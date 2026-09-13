import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SaveAnswerDto } from './dto/save-answer.dto';
import { AttemptsService } from './attempts.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('exams/:examId/attempts')
  start(@Param('examId') examId: string, @CurrentUser() user: { sub: string }) {
    return this.attemptsService.start(examId, user.sub);
  }

  @Get('attempts')
  history(@CurrentUser() user: { sub: string }) {
    return this.attemptsService.history(user.sub);
  }

  @Get('attempts/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.attemptsService.findOne(id, user.sub);
  }

  @Patch('attempts/:id/answers')
  saveAnswer(@Param('id') id: string, @Body() dto: SaveAnswerDto, @CurrentUser() user: { sub: string }) {
    return this.attemptsService.saveAnswer(id, dto, user.sub);
  }

  @Post('attempts/:id/submit')
  submit(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.attemptsService.submit(id, user.sub);
  }

  @Get('attempts/:id/result')
  result(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.attemptsService.result(id, user.sub);
  }
}
