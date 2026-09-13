import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpsertExamDto } from './dto/upsert-exam.dto';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  findPublished(@Query('subjectId') subjectId?: string) {
    return this.examsService.findPublished(subjectId);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'content_editor')
  findAll() {
    return this.examsService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'content_editor')
  findAdminById(@Param('id') id: string) {
    return this.examsService.findAdminById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'content_editor')
  create(@Body() dto: UpsertExamDto) {
    return this.examsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'content_editor')
  update(@Param('id') id: string, @Body() dto: UpsertExamDto) {
    return this.examsService.update(id, dto);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'content_editor')
  publish(@Param('id') id: string) {
    return this.examsService.publish(id);
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
