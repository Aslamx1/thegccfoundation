import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { HonoEnv } from "../types";
import type { Property } from "@/types/property";

const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Lake Victoria Sunset Villa & Community Center",
    description: "Spacious 4-bedroom contemporary villa overlooking Lake Victoria with solar backup, expansive gardens, and modern amenities.",
    location: "Munyonyo, Kampala, Uganda",
    price: 320000,
    currency: "USD",
    type: "Residential",
    bedrooms: 4,
    bathrooms: 4.5,
    areaSqFt: 4200,
    status: "available",
    imageUrl: "/images/hero-home.jpg",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prop-2",
    title: "GCC Vocational Training & Commercial Hub",
    description: "Multi-use commercial real estate with 8 workshop studios, administrative suites, high-speed fiber connectivity, and dedicated solar power.",
    location: "Entebbe Road, Wakiso, Uganda",
    price: 490000,
    currency: "USD",
    type: "Commercial",
    bedrooms: null,
    bathrooms: 6,
    areaSqFt: 7800,
    status: "available",
    imageUrl: "/images/hero-about.jpg",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "prop-3",
    title: "Highland Community Agricultural Plots (5 Acres)",
    description: "Fertile agricultural and eco-living land suitable for sustainable farming, community orchards, or eco-residential developments.",
    location: "Fort Portal, Kabarole, Uganda",
    price: 85000,
    currency: "USD",
    type: "Land",
    bedrooms: null,
    bathrooms: null,
    areaSqFt: 217800,
    status: "available",
    imageUrl: "/images/hero-transparency.jpg",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

let propertiesStore: Property[] = [...INITIAL_PROPERTIES];

export const propertiesRoute = new Hono<HonoEnv>()
  // ---------------------------------------------------------------------------
  // 1. List All Properties
  // ---------------------------------------------------------------------------
  .get("/", async (c) => {
    return c.json({
      success: true,
      data: propertiesStore,
      count: propertiesStore.length,
    });
  })

  // ---------------------------------------------------------------------------
  // 2. Get Single Property by ID
  // ---------------------------------------------------------------------------
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const property = propertiesStore.find((p) => p.id === id);
    if (!property) {
      return c.json({ success: false, message: `Property with ID "${id}" was not found.` }, 404);
    }
    return c.json({
      success: true,
      data: property,
    });
  })

  // ---------------------------------------------------------------------------
  // 3. Create New Property
  // ---------------------------------------------------------------------------
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        title: z.string().min(3).max(200),
        description: z.string().min(10),
        location: z.string().min(3),
        price: z.number().positive(),
        currency: z.string().default("USD"),
        type: z.enum(["Residential", "Commercial", "Community", "Land"]).default("Residential"),
        bedrooms: z.number().int().nonnegative().optional().nullable(),
        bathrooms: z.number().nonnegative().optional().nullable(),
        areaSqFt: z.number().positive().optional().nullable(),
        imageUrl: z.string().optional(),
      })
    ),
    async (c) => {
      const data = c.req.valid("json");
      const newProperty: Property = {
        id: `prop-${Date.now()}`,
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        currency: data.currency || "USD",
        type: data.type,
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        areaSqFt: data.areaSqFt ?? null,
        status: "available",
        imageUrl: data.imageUrl || "/images/hero-home.jpg",
        createdAt: new Date().toISOString(),
      };

      propertiesStore.unshift(newProperty);
      return c.json({ success: true, data: newProperty }, 201);
    }
  );
