import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { readExcelFile } from 'src/helpers/excel.utils';
import { GetAllEventDto } from './dto/get-all-event.dto';
import { ChangeStatusInterface, CreateEventInterface, UpdateEventInterface } from './interfaces';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) { }

  private async processActivities(buffer: Buffer) {
    const activities = await readExcelFile(buffer);
    const startDates = activities.map((item) => item.start_date);
    const finishDates = activities.map((item) => item.finish_date);

    const earliestStartDate = new Date(Math.min(...startDates));
    const latestFinishDate = new Date(Math.max(...finishDates));

    return { activities, earliestStartDate, latestFinishDate };
  }

  private mapActivityData(eventId: string, activities: any[]) {
    return activities.map((activity) => ({
      event_id: eventId,
      activity: activity.activity,
      budget: activity.budget,
      plan_start_date: activity.start_date,
      plan_end_date: activity.finish_date,
    }));
  }

  private async handleDocumentUpload(eventId: string, file: Express.Multer.File, userId: string) {
    await this.prisma.eventDocument.create({
      data: {
        event_id: eventId,
        file_type: file.mimetype,
        file_size: file.size.toString(),
        file_name: file.filename,
        document_type: 'RAB Document',
        path: file.path,
        user_id: userId,
      },
    });
  }

  async create({ data, userId, file, buffer }: CreateEventInterface) {
    const { activities, earliestStartDate, latestFinishDate } = await this.processActivities(buffer);

    return this.prisma.$transaction(async (prisma) => {
      const newEvent = await prisma.event.create({
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          category: data.category,
          client_id: data.client_id,
          start_date: earliestStartDate,
          end_date: latestFinishDate,
        },
      });

      await prisma.eventActivity.createMany({
        data: this.mapActivityData(newEvent.id, activities),
      });

      await prisma.eventDocument.create({
        data: {
          event_id: newEvent.id,
          file_type: file.mimetype,
          file_size: file.size.toString(),
          file_name: file.filename,
          document_type: 'RAB Document',
          path: file.path,
          user_id: userId,
        },
      });


      return newEvent;
    });
  }

  async findAll(params: GetAllEventDto) {
    const { page, limit, keyword, category, status } = params;
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      name: { contains: keyword, mode: 'insensitive' },
      ...(category && { category: { contains: category, mode: 'insensitive' } }),
      ...(status && { status: parseInt(status.toString()) }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.event.findMany({
        skip,
        take: +limit,
        orderBy: { created_at: 'desc' },
        where: whereCondition,
        include: { client: true },
      }),
      this.prisma.event.count({ where: whereCondition }),
    ]);

    return { rows, total };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        activities: true,
        documents: true,
        client: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    return event;
  }

  async update({ id, data, userId, file, buffer }: UpdateEventInterface) {
    const eventExists = await this.prisma.event.findUnique({ where: { id } });
    if (!eventExists) {
      throw new NotFoundException(`Event not found`);
    }

    let activities = [];
    let earliestStartDate = eventExists.start_date;
    let latestFinishDate = eventExists.end_date;

    if (file && buffer) {
      const processedData = await this.processActivities(buffer);
      activities = processedData.activities;
      earliestStartDate = processedData.earliestStartDate;
      latestFinishDate = processedData.latestFinishDate;
    }

    return this.prisma.$transaction(async (prisma) => {
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          category: data.category,
          client_id: data.client_id,
          start_date: earliestStartDate,
          end_date: latestFinishDate,
        },
      });

      if (file && buffer) {
        await prisma.eventActivity.deleteMany({ where: { event_id: id } });
        await prisma.eventActivity.createMany({
          data: this.mapActivityData(id, activities),
        });

        await prisma.eventDocument.deleteMany({ where: { event_id: id } });
        await this.handleDocumentUpload(id, file, userId);
      }

      return updatedEvent;
    });
  }

  async remove(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        activities: true,
        documents: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    return this.prisma.$transaction(async (prisma) => {
      // Remove related activities and documents
      await prisma.eventActivity.deleteMany({
        where: { event_id: id },
      });

      await prisma.eventDocument.deleteMany({
        where: { event_id: id },
      });

      // Remove the event itself
      await prisma.event.delete({
        where: { id },
      });

      return { message: `Event with ID ${id} has been successfully removed` };
    });
  }

  async updateStatus({ id, status, note }: ChangeStatusInterface) {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        status,
        note
      },
    });
  }

}
