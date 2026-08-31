import {
  Award,
  Beaker,
  Droplets,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const teamMembers = [
  {
    id: 2,
    name: "Elena Rodriguez",
    title: "Senior Massage Therapist",
    bio: "Elena brings ancient healing techniques combined with modern therapeutic practices to provide transformative massage experiences.",
    image_url:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    specialties: ["Deep Tissue Massage", "Hot Stone Therapy", "Aromatherapy"],
    years_experience: 12,
  },
  {
    id: 3,
    name: "Marcus Chen",
    title: "Skincare Specialist",
    bio: "Marcus is our expert in organic skincare treatments, focusing on natural and chemical-free approaches to achieve radiant skin.",
    image_url:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    specialties: ["Organic Facials", "Anti-Aging Treatments", "Skin Analysis"],
    years_experience: 10,
  },
  {
    id: 4,
    name: "Isabella Thompson",
    title: "Nail Art Specialist",
    bio: "Isabella creates beautiful nail art designs using only organic and toxin-free polishes, ensuring both beauty and health.",
    image_url:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    specialties: ["Nail Art", "Organic Manicures", "Hand Care Treatments"],
    years_experience: 8,
  },
];
const teamValues = [
  {
    icon: ShieldCheck,
    title: "Scientific Precision",
    description:
      "Mastery of PMU, Laser technology, and advanced skin analysis for safe, lasting, and calibrated results.",
  },
  {
    icon: Droplets,
    title: "Restorative Artistry",
    description:
      "Expertise in Natural Asian Lash design and Korean Beauty rituals to enhance, not mask, natural beauty.",
  },
  {
    icon: Beaker,
    title: "Global Mastery",
    description:
      "A relentless, international quest for the highest certifications and most advanced techniques in wellness.",
  },
];
export default function Team() {
  return (
    <div className="pt-32 pb-24 bg-gradient-to-b from-[#F8F2EC] to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#C8A882]/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#C8A882]" />
            <span className="text-sm text-[#C8A882] font-medium">The Heart of SERENITY</span>
          </div>
          <h1 className="font-serif font-medium text-[length:var(--font-h1)] text-[#0F0F0F] mb-6 leading-tight">
            The Visionary & The Experts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.618]">
            Meet the driving force behind our philosophy and the certified professionals dedicated
            to your transformation.
          </p>
        </motion.div>
        <section className="mb-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center bg-white rounded-3xl p-8 lg:p-12 shadow-2xl shadow-[#C8A882]/10 border border-[#C8A882]/20">
            <motion.div
              className="lg:col-span-5"
              initial={{
                opacity: 0,
                scale: 0.8,
                x: -50,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: 0.2,
              }}
            >
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/5]">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/687b36742c848dbd788ca716/0c96d7c03_Gemini_Generated_Image_kavr2wkavr2wkavr.png"
                  alt="Chami Chhakchhuak (Cece), Visionary Founder of SERENITY Luxury Spa & Salon in Kolkata"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </motion.div>
            <motion.div
              className="lg:col-span-7"
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: 0.4,
              }}
            >
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#0F0F0F] mb-2">
                Chami Chhakchhuak (Cece)
              </h2>
              <p className="font-sans text-lg text-[#C8A882] font-medium mb-6">
                The Visionary Founder of Serenity Salon & Spa
              </p>
              <div className="space-y-6 font-sans text-gray-700 leading-relaxed text-base lg:text-lg">
                <p>
                  "Hi, I’m Cece. For me, beauty and self-care have never been just a job; they are
                  the most meaningful way I know to connect with people. It’s my ultimate goal to
                  help every client feel
                  <strong>confident, comfortable, and radiant in their own skin.</strong>
                  That deep conviction is what led me to found
                  <strong>SERENITY</strong>
                  ."
                </p>
                <div>
                  <h3 className="font-serif text-xl lg:text-2xl font-semibold text-[#0F0F0F] mb-4 border-l-4 border-[#C8A882] pl-4">
                    My Commitment to Mastery
                  </h3>
                  <p className="mb-4">
                    My journey began with a dedication to mastering my craft, becoming a certified
                    Lash and Permanent Makeup Artist. But I quickly realized that true mastery
                    requires a continuous, global education. This drove me to pursue advanced
                    training in:
                  </p>
                  <ul className="space-y-3 list-none pl-2 text-base">
                    <li className="flex items-start">
                      <Sparkles className="w-5 h-5 text-[#C8A882] mr-3 mt-1 flex-shrink-0" />
                      <span>Natural Asian Lash Extensions & Korean Beauty Techniques</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="w-5 h-5 text-[#C8A882] mr-3 mt-1 flex-shrink-0" />
                      <span>Permanent Makeup & Laser Hair Removal</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="w-5 h-5 text-[#C8A882] mr-3 mt-1 flex-shrink-0" />
                      <span>Advanced Skincare & Therapeutic Head Spas</span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    My unique approach is a careful blend of science with artistry, creating results
                    that don’t just look striking but feel entirely natural and are built to last.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl lg:text-2xl font-semibold text-[#0F0F0F] mb-4 border-l-4 border-[#C8A882] pl-4">
                    Why I Created SERENITY
                  </h3>
                  <p>
                    After years of training, I knew I needed to create a space that reflected my
                    full philosophy—a sanctuary where you can feel completely cared for. Whether you
                    come for perfectly defined brows, flawless lashes, or a deeply relaxing spa
                    experience, my promise is care that feels both
                    <strong>luxurious and profoundly personal.</strong>
                    Serenity Salon & Spa is the realization of my lifelong passion, and I built it
                    to be your sanctuary, too.
                  </p>
                </div>
              </div>
              <p className="font-serif text-3xl text-[#C8A882] mt-8">Cece</p>
            </motion.div>
          </div>
        </section>
        <section className="mb-24 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#0F0F0F] mb-12">
            Our Philosophy in Practice
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamValues.map((e, t) => (
              <motion.div
                key={e.title}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: t * 0.2 + 0.5,
                  ease: "easeOut",
                }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-[#C8A882]/20 flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-[#C8A882]/10 rounded-full flex items-center justify-center mb-4">
                  <e.icon className="w-8 h-8 text-[#C8A882]" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#0F0F0F] mb-2">{e.title}</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">{e.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-center font-bold text-[#0F0F0F] mb-12">
            Meet Our Certified Experts
          </h2>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-[clamp(1rem,2vw,2.5rem)]">
            {teamMembers.map((e, t) => (
              <motion.div
                key={e.id}
                initial={{
                  opacity: 0,
                  y: 60,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: t * 0.2,
                  ease: "easeOut",
                }}
                className="group"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={e.image_url}
                      alt={`${e.name}, ${e.title} at SERENITY Luxury Spa & Salon Kolkata`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-[#C8A882] text-white rounded-full px-3 py-1 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span className="text-xs font-medium">{e.years_experience}+ Years</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-serif text-2xl font-bold text-[#0F0F0F] mb-2 group-hover:text-[#C8A882] transition-colors duration-300">
                      {e.name}
                    </h3>
                    <p className="text-[#C8A882] font-medium mb-4">{e.title}</p>
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">{e.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {e.specialties.map((n, r) => (
                        <span
                          key={r}
                          className="bg-[#C8A882]/10 text-[#C8A882] px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
