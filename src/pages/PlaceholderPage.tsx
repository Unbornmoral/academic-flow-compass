
interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-4">This page is under construction.</p>
    </div>
  );
};

export default PlaceholderPage;
