import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

const rooms = {}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  socket.on("join", ({ roomId, userId, color }) => {
    socket.join(roomId)
    socket.data.roomId = roomId

    if (!rooms[roomId]) rooms[roomId] = {}
    rooms[roomId][socket.id] = { name: userId, color }

    const peers = Object.entries(rooms[roomId])
      .filter(([id]) => id !== socket.id)
      .map(([id, data]) => ({ id, ...data, cursor: { x: 200, y: 200 } }))

    socket.emit("peers", peers)
    console.log(` ${userId} joined room: ${roomId}`)

    socket.to(roomId).emit("peer-joined", {
      id: socket.id,
      name: userId,
      color,
      cursor: { x: 200, y: 200 }
    })
  })

  socket.on("element", (data) => {
    console.log("Element → room", data.roomId)
    socket.to(data.roomId).emit("element", data.el)
  })

  socket.on("cursor", (data) => {
    socket.to(data.roomId).emit("cursor", {
      id: socket.id,
      x: data.x,
      y: data.y
    })
  })

  socket.on("clear", (data) => {
    socket.to(data.roomId).emit("clear")
  })

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId
    if (roomId && rooms[roomId]) {
      delete rooms[roomId][socket.id]
      socket.to(roomId).emit("peer-left", { id: socket.id })
      console.log("Disconnected:", socket.id)
    }
  })
})

httpServer.listen(3001, () => {
  console.log("Server running on http://localhost:3001")
})