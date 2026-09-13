import { Controller, Get, Param, Query } from '@nestjs/common';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  findPublished(@Query('subjectId') subjectId?: string) {
    return this.examsService.findPublished(subjectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findPublishedById(id);
  }

  @Get(':id/take')
  findForTaking(@Param('id') id: string) {
    return this.examsService.findForTaking(id);
  }
}
