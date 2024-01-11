import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
    constructor(private leaderboardService: LeaderboardService){}
    @Get()
    async getUsers(){
        return await this.leaderboardService.getAllUsers()
    }
    @Get('fakeUsers')
    async createFakeUsers(){
        await this.leaderboardService.createFakeUsers(4, 7);
    }
    @Get('fakeGame')
    async createFakeGame(){
        return await this.leaderboardService.createFakeGame(4, 5, 'POWERUP');
    }
    @Get('played')
    async getUsersWhoPlayed(){
        return await this.leaderboardService.getAllUsersWhoPlayed()
    }

    //PUBLIC CLASSIC MODE
    @Get('stats/public/classic')
    async getPublicStatsClassic(){
        return await this.leaderboardService.getPublicStats('CLASSIC')
    }

    //PUBLIC POWERUP MODE
    @Get('stats/public/powerup')
    async getPublicStatsPowerup(){
        return await this.leaderboardService.getPublicStats('POWERUP')
    }
    
    @Get('stats/public/')
    async getPublicStats()
    {
        const list_global_public = []
        const list_classic_public = await this.leaderboardService.getPublicStats('CLASSIC');
        const list_power_public = await this.leaderboardService.getPublicStats('POWERUP');
        list_global_public.push(list_classic_public)
        list_global_public.push(list_power_public)
        return list_global_public
    }
}
