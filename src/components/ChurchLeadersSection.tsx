import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface LeaderCardProps {
  image: string;
  name: string;
  role: string;
}

const LeaderCard = ({ image, name, role }: LeaderCardProps) => (
  <div className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300 group">
    <div className="aspect-[3/4] overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-4 text-center">
      <h4 className="font-display text-lg text-foreground">{name}</h4>
      <p className="text-muted-foreground text-sm font-body">{role}</p>
    </div>
  </div>
);

const leaders = [
  { id: 1, name: "Lay Reader 1", role: "Lay Reader", image: "/images/leaders/lay1.jpg" },
  { id: 2, name: "Lay Reader 2", role: "Lay Reader", image: "/images/leaders/lay2.jpg" },
  { id: 3, name: "Lay Reader 3", role: "Lay Reader", image: "/images/leaders/lay3.jpg" },
  { id: 4, name: "Lay Reader 4", role: "Lay Reader", image: "/images/leaders/lay4.jpg" },
  { id: 5, name: "Lay Reader 5", role: "Lay Reader", image: "/images/leaders/lay5.png" },
];

const ChurchLeadersSection = () => {
  return (
    <section id="church-leaders" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Main Image Banner */}
        <div className="relative rounded-xl overflow-hidden mb-12 bg-navy">
          <img
            src="/images/church-leaders-group.jpg"
            alt="ACK St. Stephen's Church Clergy and Lay Readers"
            className="w-full h-auto max-h-[500px] object-contain mx-auto"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy via-navy/90 to-transparent p-6 md:p-10">
            <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-2">
              Our Church Leaders
            </h2>
            <p className="text-primary-foreground/80 font-body max-w-2xl">
              Meet our dedicated clergy and lay readers who faithfully serve our congregation 
              and community with love and devotion.
            </p>
          </div>
        </div>

        {/* Leaders Carousel */}
        <div className="mb-8">
          <h3 className="font-display text-2xl text-navy text-center mb-8">
            Clergy & Lay Readers
          </h3>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {leaders.map((leader) => (
                <CarouselItem key={leader.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <LeaderCard
                    image={leader.image}
                    name={leader.name}
                    role={leader.role}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
        </div>

      </div>
    </section>
  );
};

export default ChurchLeadersSection;
