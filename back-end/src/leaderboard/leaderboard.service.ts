import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from "@faker-js/faker"
import { constants } from 'buffer';

//user game relationship is a one - to many relationship
@Injectable()
export class LeaderboardService {
    constructor(private prismaService: PrismaService){

    }
    // public players
    async getPublicStats(gameType:'CLASSIC' | 'POWERUP') {
        const users = await this.prismaService.user.findMany({
            where: {
                OR: [
                    { player1: { some: {type:gameType} } },
                    { player2: { some: {type:gameType} } }
                ]
            },
            select: {
                username: true,
                id: true,
                avatar:true,
                player1: {
                    select: { id: true, player1Score: true, status: true, winnerPlayerId:true }
                },
                player2: {
                    select: { id: true, player2Score: true, status: true, winnerPlayerId:true }
                }
            }
        });
    
        return users.map(user => {
            let wins = 0;
            let losses = 0;
            let totalScore = 0;
            user.player1.forEach(game => {
                if (game.status === 'ENDED' &&  game.winnerPlayerId === user.id) {
                    wins++;
                } else if (game.status === 'ENDED') {
                    losses++;
                }
                totalScore += game.player1Score;
            });
    
            user.player2.forEach(game => {
                if (game.status === 'ENDED' && game.winnerPlayerId === user.id) {
                    wins++;
                } else if (game.status === 'ENDED') {
                    losses++;
                }
                totalScore += game.player2Score;
            });
    
            return {

                username: user.username,
                avatar: user.avatar,
                id:user.id,
                wins,
                losses,
                totalScore,
                rank: 0
            };
        });
    }

    //return first 3 and the rest 
    async getPublicStatsSorted(gameType:'CLASSIC' | 'POWERUP'){
        const sorted_list = (await this.getPublicStats(gameType)).sort((a, b)=> b.totalScore - a.totalScore);
        sorted_list.forEach((user, index) => {
            user.rank = index + 1;
        });
        return sorted_list
    }

    async getAllUsersWhoPlayed(){
        const users = await this.prismaService.user.findMany({
                    where: {
                        OR: [
                            { player1: { some: {} } },
                            { player2: { some: {} } }
                        ]
                    }
                })
        return users
    }

    async getAllUsers(){
        // return "hello"
       return await this.prismaService.user.findMany()
    }

    
  async createFakeUsers(n: number, startId:number): Promise<void> {
    let start = startId
    for (let i = 0; i < n; i++) {
      await this.prismaService.user.create({
        data: {
            id: start,
          username: faker.internet.userName(),
          displayName: faker.person.firstName(),
          avatar: faker.image.avatar(),
        //   level: faker.datatype.float({ min: 0, max: 100 }),
          bio: faker.lorem.sentence(),
          // Set other fields as needed
        },
      });
      start++
    }
  }

  async createFakeGame(id1:number, id2:number, gameType: 'CLASSIC' | 'POWERUP' ){
    const player1 = await this.prismaService.user.findUnique(
        {
            where: {id:id1}
        }
    )
    const player2 = await this.prismaService.user.findUnique(
        {
            where: {id:id2}
        }
    )
    const newGame = await this.prismaService.game.create(
       { 
        data:{
            type: gameType,
            player1Id: player1.id,
            player2Id:player2.id,
            status: 'ENDED',
            winnerPlayerId: player1.id
        }
        }
    )
    return newGame
  }
    
}

