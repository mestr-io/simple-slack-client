const std = @import("std");

const zqlite = @import("zqlite");

const schemas = @import("schemas.zig");

fn createChannelsTable(conn: zqlite.Conn) !void {
    try conn.exec("create table if not exists channels (id text, name text)", .{});
}

pub fn storeChannels(channels: []schemas.Channel) !void {
    const flags = zqlite.OpenFlags.Create | zqlite.OpenFlags.EXResCode;
    var conn = try zqlite.open("db.sqlite", flags);
    defer conn.close();
    try createChannelsTable(conn);

    // std.debug.print("Channels {any}", .{channels});

    for (channels) |channel| {
        try conn.exec("insert into channels (id, name) values (?1, ?2)", .{ channel.id, channel.name });
    }

    {
        var rows = try conn.rows("select * from channels order by name", .{});
        defer rows.deinit();
        while (rows.next()) |row| {
            std.debug.print("name: {s}\n", .{row.text(0)});
        }
        if (rows.err) |err| return err;
    }
}
