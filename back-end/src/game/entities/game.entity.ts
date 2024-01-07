import  express  from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
	origin: "*",
  },
});


type Room = {
	  id: any;
  players: Array<Player>;
  ball: Ball;
  winner: number;
};

type Player = {
	  socketID: string;
  playerNo: number;
  score: number;
  x: number;
  y: number;
};

type Ball = {
	  x: number;
  y: number;
  dx: number;
  dy: number;
};

let rooms: Array<any> = [];

io.on("connection", (socket) => {
	console.log("a user connected");
	
	socket.on('join', () => {

		//get room
		let room: Room | undefined;

        // Find an available room or undefined if none exists
        if (rooms.length > 0 && rooms[rooms.length - 1].players.length === 1) {
            room = rooms[rooms.length - 1];
        }
		console.log(room, rooms.length);
		if (room) {
			socket.join(room.id);
			socket.emit('playerNo', 2);

			//add player to room
			room.players.push({
				socketID: socket.id,
				playerNo: 2,
				score: 0,
				x: 690,
				y: 200,
			});

			//send message to room
			io.to(room.id).emit('startingGame');

			setTimeout(() => {
				if (room){
				io.to(room.id).emit('startedGame', room);

				// start game
				startGame(room);}
			}, 3000);
		}
		else{

			room = {
				id: rooms.length + 1,
				players: [{
					socketID: socket.id,
					playerNo: 1,
					score: 0,
					x: 90,
					y: 200,
				}],
				ball: {
					x: 395,
					y: 245,
					dx: Math.random() < 0.5 ? 1: -1,
					dy: 0,
				},
				winner: 0,
			}
			rooms.push(room);
			socket.join(room.id);
			socket.emit('playerNo', 1);
		}
	});


	socket.on('move', (data) => {
		let room = rooms.find(room => room.id === data.roomID);
		if (room) {
			console.log(data);
			// Check if playerNo is within the array bounds
			if (data.playerNo >= 1 && data.playerNo <= room.players.length) {
				const playerIndex = data.playerNo - 1;
				const player = room.players[playerIndex];
				console.log(player);
	
				// Ensure the player exists
				if (player) {
					if (data.direction === 'up'){
						player.y -= 10;
						if (player.y < 0){
							player.y = 0;
						}
						console.log(player.y, player.x)
					} else if (data.direction === 'down'){
						player.y += 10;
						if (player.y > 440){
							player.y = 440;
						}
					}
	
					// Update room in rooms array
					rooms = rooms.map(r => r.id === room.id ? room : r);
	
					io.to(room.id).emit('updateGame', room);
				}
			}
		}
	});
	

	socket.on("leave", (roomID) => {
		socket.leave(roomID);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

function startGame(room: Room){
	let interval = setInterval(() => {
		room.ball.x += room.ball.dx * 5;
		room.ball.y += room.ball.dy * 5;

		//check if ball hits player 1
		if (room.ball.x < 100 && room.ball.y >= room.players[0].y && room.ball.y <= room.players[0].y + 100){
			room.ball.dx = 1;

			//change ball direction
			if (room.ball.y < room.players[0].y + 50){
				room.ball.dy = -1;
			}
			else{
				room.ball.dy = 1;
			}
		}

		//check if ball hits player 2
		if (room.ball.x > 700 && room.ball.y >= room.players[1].y && room.ball.y <= room.players[1].y + 100){
			room.ball.dx = -1;

			//change ball direction
			if (room.ball.y < room.players[1].y + 50){
				room.ball.dy = -1;
			}
			else{
				room.ball.dy = 1;
			}
		}

		//check if ball hits top or bottom wall
		if (room.ball.y < 0 || room.ball.y > 490){
			room.ball.dy *= -1;
		}

		// check if ball hits left or right wall and reset it if it does
		if (room.ball.x < 0){
			room.players[1].score++;
			room.ball = {
				x: 395,
				y: 245,
				dx: 1,
				dy: 0,
			};
		}
		else if (room.ball.x > 800){
			room.players[0].score++;
			room.ball = {
				x: 395,
				y: 245,
				dx: -1,
				dy: 0,
			};
		}

		// //check if ball hits left or right wall
		// if (room.ball.x < 0){
		// 	room.winner = 2;
		// 	clearInterval(interval);
		// }
		// else if (room.ball.x > 800){
		// 	room.winner = 1;
		// 	clearInterval(interval);
		// }

		// winner
		if (room.players[0].score === 3){
			room.winner = 1;
			rooms = rooms.filter(r => r.id !== room.id);
			io.to(room.id).emit('gameOver', room);
			clearInterval(interval);
		}
		else if (room.players[1] && room.players[1].score === 3){
			room.winner = 2;
			rooms = rooms.filter(r => r.id !== room.id);
			io.to(room.id).emit('gameOver', room);
			clearInterval(interval);
		}

		io.to(room.id).emit('updateGame', room);
	}, 1000 / 60);
}

server.listen(3001, () => {
	  console.log("listening on *:3001");
});