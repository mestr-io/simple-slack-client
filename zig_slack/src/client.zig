const std = @import("std");
const fmt = std.fmt;
const http = std.http;
const json = std.json;
const process = std.process;

const schemas = @import("schemas.zig");

pub fn Response(comptime T: type) type {
    return struct {
        arena: std.heap.ArenaAllocator,
        body: T,

        pub fn deinit(self: *@This()) void {
            self.arena.deinit();
        }
    };
}

pub const Client = struct {
    allocator: std.mem.Allocator,
    authorization_header: []u8 = undefined,

    pub fn init(allocator: std.mem.Allocator) !Client {
        const token = try process.getEnvVarOwned(allocator, "SLACK_TOKEN");
        defer allocator.free(token);

        var authorization_header_buf: [64]u8 = undefined;
        const authorization_header = try fmt.bufPrint(&authorization_header_buf, "Bearer {s}", .{token});

        return .{
            .authorization_header = authorization_header,
            .allocator = allocator,
        };
    }

    // pub fn deinit(self: Client) void {
    //     self.http_client.deinit();
    // }

    fn httpRequest(self: Client, url: std.Uri) ![]u8 {
        var client = std.http.Client{ .allocator = self.allocator };
        defer client.deinit();

        var server_header_buffer: [8192]u8 = undefined; // 8kb
        var request = try client.open(.GET, url, .{
            .server_header_buffer = &server_header_buffer,
        });
        defer request.deinit();

        request.headers.authorization = .{ .override = self.authorization_header };

        try request.send();
        try request.finish();
        try request.wait();

        return try request.reader().readAllAlloc(self.allocator, 1024 * 1024);
    }

    pub fn getSlack(self: Client, comptime T: type, url: std.Uri) !Response(T) {
        const body = try self.httpRequest(url);
        defer self.allocator.free(body);
        //
        // std.debug.print("Raw response:\n{s}\n", .{body});
        //
        var arena = std.heap.ArenaAllocator.init(self.allocator);
        errdefer arena.deinit();

        const parsed = try json.parseFromSliceLeaky(T, arena.allocator(), body, .{
            .allocate = .alloc_always,
            .ignore_unknown_fields = true,
        });

        return Response(T){
            .arena = arena,
            .body = parsed,
        };
    }

    pub fn getChannels(self: Client) !Response(schemas.Channels) {
        const url = comptime std.Uri.parse("https://slack.com/api/conversations.list") catch unreachable;
        return self.getSlack(schemas.Channels, url);
    }

    pub fn getUserInfo(self: Client, user_id: []const u8) !Response(schemas.UserResponse) {
        var buf: [256]u8 = undefined;
        const url_str = try std.fmt.bufPrint(&buf, "https://slack.com/api/users.info?user={s}", .{user_id});
        const url = try std.Uri.parse(url_str);
        return self.getSlack(schemas.UserResponse, url);
    }
};
