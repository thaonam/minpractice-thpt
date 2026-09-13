import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SaveAnswerDto } from './dto/save-answer.dto';
import { AttemptsService } from './attempts.service';

@Controller()
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('exams/:examId/attempts')
  start(@Param('examId') examId: string) {
    return this.attemptsService.start(examId);
  }

  @Get('attempts/:id')
  findOne(@Param('id') id: string) {
    return this.attemptsService.findOne(id);
  }

  @Patch('attempts/:id/answers')
  saveAnswer(@Param('id') id: string, @Body() dto: SaveAnswerDto) {
    return this.attemptsService.saveAnswer(id, dto);
  }

  @Post('attempts/:id/submit')
  submit(@Param('id') id: string) {
    return this.attemptsService.submit(id);
  }

  @Get('attempts/:id/result')
  result(@Param('id') id: string) {
    return this.attemptsService.result(id);
  }
}
