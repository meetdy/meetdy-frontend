import FeatureBox from '../FeatureBox';

interface FeatureProps {
  data?: Array<{
    image?: string;
    title?: string;
    descrpition?: string;
  }>;
}

function Feature({ data = [] }: FeatureProps) {
  return (
    <section className="py-24 px-4 bg-muted/30" id="features">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            Tính năng nổi bật
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Tính năng
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá các tính năng mạnh mẽ giúp bạn kết nối và giao tiếp hiệu quả hơn
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((ele, index) => (
            <FeatureBox data={ele} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Feature;
