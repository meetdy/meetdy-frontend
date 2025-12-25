import { useSelector } from 'react-redux';
import { Loading } from '@/components/ui/loading';
import AboutWebApp from './Components/AboutWebApp';
import Developer from './Components/Developer';
import Feature from './Components/Feature';
import Footer from './Components/Footer';
import Header from './Components/Header';

function Home() {
  const { developers, infoApp, isLoading, features, infoWebApps } = useSelector(
    (state: any) => state.home,
  );

  return (
    <Loading size="lg" spinning={isLoading}>
      <div className="min-h-screen bg-background">
        <Header data={infoApp} />
        <Feature data={features} />
        <AboutWebApp data={infoWebApps} />
        <Developer data={developers} />
        <Footer data={infoWebApps} />
      </div>
    </Loading>
  );
}

export default Home;
