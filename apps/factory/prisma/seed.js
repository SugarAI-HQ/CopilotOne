import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  try {
    const existingBlogs = await prisma.blog.findMany();

    if (existingBlogs.length > 0) {
      console.log("Data already exists. Exiting seed script.");
      return;
    }

    await prisma.blog.createMany({
      data: [
        {
          title: "Sample Blog 1",
          description: "This is the first sample blog",
          slug: "sample-blog-1",
          tags: ["tag1", "tag2"],
          publishedAt: new Date("2024-02-14T12:00:00Z"),
          mediaUrl: "https://www.youtube.com/watch?v=n9tYg541kWE",
          mediaType: "VIDEO",
          previewImage: "https://i.ytimg.com/vi/n9tYg541kWE/hqdefault.jpg",
        },
        {
          title: "Sample Blog 2",
          description: "This is the second sample blog",
          slug: "sample-blog-2",
          tags: ["tag3", "tag4"],
          mediaUrl: "https://www.youtube.com/watch?v=n9tYg541kWE",
          mediaType: "VIDEO",
          previewImage: "https://i.ytimg.com/vi/n9tYg541kWE/hqdefault.jpg",
        },
        {
          title: "Sample Blog 3",
          description: "This is the first sample blog",
          slug: "sample-blog-3",
          tags: ["tag1", "tag2"],
          publishedAt: new Date("2024-02-14T12:00:00Z"),
          mediaUrl: "https://www.youtube.com/watch?v=n9tYg541kWE",
          mediaType: "VIDEO",
          previewImage: "https://i.ytimg.com/vi/n9tYg541kWE/hqdefault.jpg",
        },
        {
          title: "Sample Blog 4",
          description: "This is the second sample blog",
          slug: "sample-blog-4",
          tags: ["tag3", "tag4"],
          mediaUrl: "https://example.com/image2.jpg",
          mediaType: "VIDEO",
          previewImage: "https://i.ytimg.com/vi/n9tYg541kWE/hqdefault.jpg",
        },
        {
          title: "Sample Blog 5",
          description: "This is the first sample blog",
          slug: "sample-blog-5",
          tags: ["tag1", "tag2"],
          publishedAt: new Date("2024-02-14T12:00:00Z"),
          mediaUrl: "https://www.youtube.com/watch?v=n9tYg541kWE",
          mediaType: "VIDEO",
          previewImage: "https://i.ytimg.com/vi/n9tYg541kWE/hqdefault.jpg",
        },
        {
          title: "Sample Blog 6",
          description: "This is the second sample blog",
          slug: "sample-blog-6",
          tags: ["tag3", "tag4"],
          mediaUrl: "https://example.com/image2.jpg",
          mediaType: "VIDEO",
          previewImage: "https://i.ytimg.com/vi/n9tYg541kWE/hqdefault.jpg",
        },
        {
          title: "Sample Blog 7",
          description: "This is the first sample blog",
          slug: "sample-blog-7",
          tags: ["tag1", "tag2"],
          publishedAt: new Date("2024-02-14T12:00:00Z"),
          mediaUrl: "https://www.youtube.com/watch?v=n9tYg541kWE",
          mediaType: "IMAGE",
          previewImage: "https://i.ytimg.com/vi/n9tYg541kWE/hqdefault.jpg",
        },
        {
          title: "Sample Blog 8",
          description: "This is the second sample blog",
          slug: "sample-blog-8",
          tags: ["tag3", "tag4"],
          mediaUrl: "https://example.com/image2.jpg",
          mediaType: "VIDEO",
          previewImage: "https://i.ytimg.com/vi/n9tYg541kWE/hqdefault.jpg",
        },
      ],
    });

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
