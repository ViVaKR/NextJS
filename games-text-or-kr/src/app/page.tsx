
export default function Home() {

  const env = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  return (


    <div>
      <h1>Home</h1>
      <p>
        {env}
      </p>
    </div>
  );
}
