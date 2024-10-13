import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { readExcelFile } from 'src/helpers/excel.utils';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {
  }

  async create(data: CreateEventDto, buffer: Buffer, file: Express.Multer.File, user_id: string) {
    
    const activities = await readExcelFile(buffer)
    // Extract all start and finish dates
    const startDates = activities.map(item => item.start_date);
    const finishDates = activities.map(item => item.finish_date);

    // Find the earliest start date and the latest finish date
    const earliestStartDate = new Date(Math.min(...startDates));
    const latestFinishDate = new Date(Math.max(...finishDates));

    return this.prisma.$transaction(async (prisma) => {
      const newEvent = await prisma.event.create({
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          category: data.category,
          client_id: data.client_id,
          start_date: earliestStartDate,
          end_date: latestFinishDate
        },
      });

      // const permissionsData = data.permissions.map(permissionId => ({
      //    role_id: newRole.id,
      //    permission_id: permissionId,
      // }));

      const storedActivity = activities.map(activity => ({
        event_id: newEvent.id,
        activity: activity.activity,
        budget: activity.budget,
        plan_start_date: activity.start_date,
        plan_end_date: activity.finish_date
      }))

      await prisma.eventActivity.createMany({
        data: storedActivity,
      });

      await prisma.eventDocument.createMany({
        data: {
          event_id: newEvent.id,
          file_type: file.mimetype,
          file_size: file.size.toString(),
          file_name: file.filename,
          document_type: "RAB Document",
          path: file.path,
          user_id
        }
      });

      return newEvent;
    });
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
