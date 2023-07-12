import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const crudRouter = createTRPCRouter({
  getStudentsWithCoursesOnId: publicProcedure
    .input(z.object({ studentId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: data student berdasarkan id yang diberikan, kalau id tidak diberikan, fetch semua data
      const con = input.studentId? { id: input.studentId } : {};

      return await ctx.prisma.student.findMany({
        where: con,
        include: {
          enrollment: {
            select: {
              crsId: {
                select: {
                  name: true,
                  credits: true
                }
              }
            }
          }
        }
      });
    }),

  getAllCourses: publicProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
    // Expected output: seluruh data course yang ada
    return await ctx.prisma.course.findMany() 
  }),

  getStudentsListOnCourseId: publicProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: data course berdasarkan id yang diberikan beserta seluruh student yang mengikutinya
      return await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId
        },
        include: {
          enrollment: {
            select: {
              stdId: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });
    }),

  insertNewStudent: publicProcedure
    .input(z.object({ firstName: z.string(), lastName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert
      return await ctx.prisma.student.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName
        }
      });
    }),

  insertNewCourse: publicProcedure
    .input(z.object({ name: z.string(), credits: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert
      return await ctx.prisma.course.create({
        data: {
          name: input.name,
          credits: input.credits
        }
      });
    }),

  enrollNewStudent: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert, enrollment_date mengikuti waktu ketika fungsi dijalankan
      return await ctx.prisma.enrollment.create({
        data: {
          studentId: input.studentId,
          courseId: input.courseId,
          enrollmentDT: new Date()
        }
      });
    }),

  updateCourseData: publicProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        name: z.string().optional(),
        credits: z.number().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di update berdasarkan courseId yang diberikan, apabila name atau credits tidak diberikan, tidak usah di update
      return await ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },
        data: {
          name: input.name,
          credits: input.credits,
          updateAt: new Date()
        }
      });
    }),

  removeStudentfromCourse: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di delete
      return await ctx.prisma.enrollment.deleteMany({
        where:{
          studentId: input.studentId,
          courseId: input.courseId
        }
      });
    })
});
