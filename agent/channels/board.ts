import { defineChannel, GET } from "eve/channels";
import { readBoard, renderBoardMd } from "../lib/board";

export default defineChannel({
  routes: [
    GET("/board", async () => {
      const board = await readBoard();
      if (!board) {
        return new Response(JSON.stringify({ error: "no board yet" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        });
      }
      return Response.json(board);
    }),
    GET("/board/md", async () => {
      const board = await readBoard();
      if (!board) {
        return new Response("no board yet", { status: 404 });
      }
      return new Response(renderBoardMd(board), {
        headers: { "content-type": "text/markdown; charset=utf-8" },
      });
    }),
  ],
});
