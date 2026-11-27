export interface CustomerTestimonial {
  id: string;
  name: string;
  quote: string;
  project?: string;
  location?: string;
  approvedForPublication: boolean;
}

// Add real customer feedback here after confirming the text and display name.
// The public section stays hidden until at least one entry is approved.
export const testimonials: CustomerTestimonial[] = [];
