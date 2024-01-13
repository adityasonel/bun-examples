class HelloWorld {
  sayHelloWorld = (): void => {
    console.log('Hello World via Bun 👋');
  };
}

const helloWorld = new HelloWorld();
helloWorld.sayHelloWorld();
