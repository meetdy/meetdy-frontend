import DevInfoBox from '../DevInfoBox';

interface DeveloperProps {
  data?: Array<{
    image?: string;
    name?: string;
    email?: string;
    github?: string;
  }>;
}

function Developer({ data = [] }: DeveloperProps) {
  return (
    <section className="py-24 px-4 bg-muted/30" id="developer">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            Đội ngũ phát triển
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Team phát triển
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gặp gỡ những người đã xây dựng nên Meetdy Chat
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {data.map((ele, index) => (
            <DevInfoBox data={ele} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Developer;
