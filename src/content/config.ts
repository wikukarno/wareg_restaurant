import { defineCollection, z } from "astro:content";

const dishSchema = z.object({
  name: z.string(),
  slug: z.string(),
  category: z.enum(["juice", "vegetable", "healthy", "seafood"]),
  price: z.number(),
  description: z.string(),
  image: z.string(),
  rating: z.number().min(0).max(5).default(4.8),
  tags: z.array(z.string()).default([]),
  isSpecial: z.boolean().default(false),
});

const chefSchema = z.object({
  name: z.string(),
  title: z.string(),
  image: z.string(),
  verified: z.boolean().default(false),
  specialty: z.string().optional(),
});

const reviewSchema = z.object({
  name: z.string(),
  avatar: z.string(),
  rating: z.number(),
  body: z.string(),
  date: z.string(),
});

export const collections = {
  menu: defineCollection({ type: "data", schema: dishSchema }),
  chefs: defineCollection({ type: "data", schema: chefSchema }),
  reviews: defineCollection({ type: "data", schema: reviewSchema }),
};

export type Dish = z.infer<typeof dishSchema>;
export type Chef = z.infer<typeof chefSchema>;
export type Review = z.infer<typeof reviewSchema>;
