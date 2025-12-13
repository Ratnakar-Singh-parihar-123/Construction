import React from 'react';
import Icon from 'components/AppIcon';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Vikram Mehta',
      company: 'Skyline Developers',
      role: 'Project Manager',
      testimonial: 'Working with ConstructHub Pro has been exceptional. Their timely delivery and quality materials have been crucial for our high-rise projects. The customer service team is always responsive to our urgent requirements.',
      rating: 5,
      project: '25-storey Residential Tower',
      icon: 'User'
    },
    {
      name: 'Sunita Reddy',
      company: 'SR Constructions',
      role: 'Managing Director',
      testimonial: 'As a contractor handling multiple projects, reliable material supply is critical. ConstructHub Pro has never let us down. Their competitive pricing and consistent quality make them our first choice.',
      rating: 5,
      project: 'Commercial Complex Phase 1 & 2',
      icon: 'User'
    },
    {
      name: 'Arjun Nair',
      company: 'Nair Infrastructure',
      role: 'Civil Engineer',
      testimonial: 'The technical expertise and material recommendations from their team have helped us optimize costs without compromising on quality. Their after-sales support is commendable.',
      rating: 5,
      project: 'Highway Bridge Construction',
      icon: 'User'
    },
    {
      name: 'Kavita Deshmukh',
      company: 'Urban Homes Pvt Ltd',
      role: 'Architect',
      testimonial: 'From cement to finishing materials, ConstructHub Pro provides everything under one roof. The online ordering system makes procurement incredibly convenient for our design-build projects.',
      rating: 5,
      project: 'Luxury Villa Development',
      icon: 'User'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Success stories from contractors and builders who trust us with their projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials?.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-elevation-2 transition-micro"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial?.rating)]?.map((_, i) => (
                    <Icon key={i} name="Star" size={18} color="text-yellow-500" fill="currentColor" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial?.testimonial}"
                </p>

                {/* Project Badge */}
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-4">
                  Project: {testimonial?.project}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={testimonial?.icon} size={24} color="var(--color-primary)" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{testimonial?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial?.role}, {testimonial?.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;