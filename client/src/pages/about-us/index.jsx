import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import WhatsAppButton from '../../components/WhatsAppButton';
import Footer from '../home-page/components/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { motion, useInView } from 'framer-motion';

const AboutUs = () => {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  
  const statsInView = useInView(statsRef, { once: true });
  const storyInView = useInView(storyRef, { once: true });
  const valuesInView = useInView(valuesRef, { once: true });
  const teamInView = useInView(teamRef, { once: true });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { 
      value: '5000+', 
      label: 'Projects Delivered', 
      icon: 'Building2',
      description: 'Successfully completed projects across residential, commercial, and industrial sectors'
    },
    { 
      value: '2500+', 
      label: 'Happy Customers', 
      icon: 'Users',
      description: 'Satisfied clients including contractors, architects, and homeowners'
    },
    { 
      value: '20+', 
      label: 'Years Experience', 
      icon: 'Calendar',
      description: 'Two decades of expertise in construction materials and solutions'
    },
    { 
      value: '24/7', 
      label: 'Support', 
      icon: 'Headphones',
      description: 'Round-the-clock customer service and technical assistance'
    }
  ];

  const values = [
    {
      icon: 'Award',
      title: 'Quality Excellence',
      description: 'We source only certified, premium-grade construction materials from trusted manufacturers and conduct rigorous quality checks',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'Shield',
      title: 'Integrity & Trust',
      description: 'Built on 20+ years of transparent dealings, fair pricing, and reliable partnerships that stand the test of time',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: 'Clock',
      title: 'Timely Precision',
      description: 'Guaranteed on-time delivery with real-time tracking and efficient logistics management',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: 'Users',
      title: 'Customer First',
      description: 'Personalized consultation, technical support, and solutions tailored to each project requirement',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      experience: '25+ years in construction industry',
      expertise: 'Material Science & Supply Chain Management',
      quote: '"Quality materials build lasting structures and enduring relationships"',
      imageColor: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Priya Sharma',
      role: 'Operations Director',
      experience: '18+ years in operations management',
      expertise: 'Logistics & Quality Control',
      quote: '"Efficiency in delivery is as important as excellence in materials"',
      imageColor: 'from-green-500 to-green-600'
    },
    {
      name: 'Amit Patel',
      role: 'Technical Director',
      experience: '22+ years in civil engineering',
      expertise: 'Structural Materials & Solutions',
      quote: '"Innovation in materials technology drives sustainable construction"',
      imageColor: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Sanjay Verma',
      role: 'Customer Relations Head',
      experience: '15+ years in client management',
      expertise: 'Project Consultation & Support',
      quote: '"Every project is unique, and so is our approach to serving it"',
      imageColor: 'from-purple-500 to-purple-600'
    }
  ];

  const milestones = [
    { year: '2005', title: 'Foundation', description: 'Started as a small family business with 10 employees' },
    { year: '2010', title: 'Expansion', description: 'Opened first regional warehouse and distribution center' },
    { year: '2015', title: 'Digital Transformation', description: 'Launched online platform and mobile app' },
    { year: '2020', title: 'National Presence', description: 'Expanded to 15 cities across India' },
    { year: '2023', title: 'Innovation Hub', description: 'Established R&D center for sustainable materials' }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - ConstructHub Pro | Building India's Future</title>
        <meta name="description" content="Discover ConstructHub Pro - Two decades of excellence in providing premium construction materials. Trusted by 2500+ clients for 5000+ successful projects." />
        <meta name="keywords" content="construction materials, building supplies, construction company, construction materials supplier" />
      </Helmet>

      <div className="min-h-screen bg-white overflow-hidden">
        <Header />

        <main className="pt-16">
          {/* Hero Section with Parallax Effect */}
          <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
                  <Icon name="Building2" size={20} className="text-blue-400" />
                  <span className="text-sm font-semibold text-white">Building Trust Since 2005</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  Building India's <span className="text-blue-400">Infrastructure</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  For over two decades, we've been the backbone of India's construction industry, 
                  providing premium materials and innovative solutions for monumental projects.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-700 px-8"
                    onClick={() => navigate('/contact-us')}
                  >
                    <Icon name="Phone" size={20} className="mr-2" />
                    Partner With Us
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8"
                    onClick={() => navigate('/products-catalog')}
                  >
                    <Icon name="Package" size={20} className="mr-2" />
                    Explore Materials
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <Icon name="ChevronDown" size={24} className="text-white/60" />
            </motion.div>
          </section>

          {/* Company Story */}
          <section ref={storyRef} className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
              >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-block mb-4">
                      <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Journey</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                      From Humble Beginnings to Industry <span className="text-blue-600">Leadership</span>
                    </h2>
                    <div className="space-y-4 text-gray-700">
                      <p className="text-lg leading-relaxed">
                        Founded in 2005 by civil engineer Rajesh Kumar, ConstructHub Pro started as a 
                        modest family enterprise with a single warehouse. Driven by a vision to transform 
                        India's construction landscape, we focused on bridging the gap between quality 
                        materials and accessible supply.
                      </p>
                      <p className="text-lg leading-relaxed">
                        Through strategic partnerships with global manufacturers and relentless focus 
                        on customer satisfaction, we expanded our footprint across 15 major cities, 
                        becoming a trusted name in both residential and industrial construction sectors.
                      </p>
                      <p className="text-lg leading-relaxed">
                        Today, we stand as a technology-driven enterprise combining traditional values 
                        with modern innovation, serving prestigious projects from skyscrapers to smart cities.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                      <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4XNWFZ4kKqr_ni1W022RqV5ObGhcqeSeMlQ&s"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
                    </div>
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon name="Award" size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">20+</div>
                          <div className="text-sm text-gray-600">Industry Awards</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Milestone Timeline */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Milestones</h2>
                <p className="text-gray-600 text-lg">Two decades of growth and innovation</p>
              </div>

              <div className="relative max-w-4xl mx-auto">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
                
                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={storyInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <div className="w-1/2 px-8">
                        <div className={`bg-white p-6 rounded-xl shadow-lg ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                          <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                      </div>
                      <div className="w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section ref={statsRef} className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">By The Numbers</h2>
                <p className="text-gray-300">Our impact in numbers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={statsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon name={stat.icon} size={28} className="text-white" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
                    <div className="text-sm text-gray-300">{stat.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section ref={valuesRef} className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-block mb-4">
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Philosophy</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Core Values That <span className="text-blue-600">Define Us</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  The principles that guide every decision and action at ConstructHub Pro
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="relative bg-white border border-gray-200 rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon name={value.icon} size={28} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Leadership Team */}
          <section ref={teamRef} className="py-20 md:py-28 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-block mb-4">
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Leadership</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Meet Our <span className="text-blue-600">Visionaries</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  The experienced minds guiding ConstructHub Pro towards excellence
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {team.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={teamInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      <div className="relative h-64 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${member.imageColor}`}></div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${member.imageColor} flex items-center justify-center`}>
                              <Icon name="User" size={48} className="text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-16 pb-8 px-6 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                        <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                        <p className="text-sm text-gray-500 mb-4">{member.experience}</p>
                        <p className="text-sm text-gray-600 mb-4 font-medium">{member.expertise}</p>
                        <div className="border-t pt-4 mt-4">
                          <p className="text-gray-600 italic text-sm">"{member.quote}"</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Vision & Mission */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-10"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon name="Target" size={28} className="text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To revolutionize India's construction industry by making premium-quality materials 
                    accessible, affordable, and sustainable, while setting new benchmarks in customer 
                    service and technological innovation.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-3xl p-10"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon name="Flag" size={28} className="text-orange-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To empower builders, contractors, and developers with reliable, high-quality 
                    construction materials through an efficient supply chain, expert consultation, 
                    and digital solutions that simplify construction processes.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4XNWFZ4kKqr_ni1W022RqV5ObGhcqeSeMlQ&s"
                    alt="Construction Site"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/90"></div>
                </div>
                
                <div className="relative z-10 py-20 px-8 text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Build Something <span className="text-blue-300">Extraordinary?</span>
                  </h2>
                  <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                    Partner with India's most trusted construction materials supplier. 
                    Let's build the future together.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      variant="primary"
                      className="bg-white text-blue-700 hover:bg-gray-100 px-10 py-4 text-lg font-semibold"
                      onClick={() => navigate('/contact-us')}
                    >
                      <Icon name="Phone" size={20} className="mr-3" />
                      Schedule a Consultation
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/20 px-10 py-4 text-lg font-semibold"
                      onClick={() => navigate('/request-quote')}
                    >
                      <Icon name="FileText" size={20} className="mr-3" />
                      Get Custom Quote
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default AboutUs;