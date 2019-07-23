<section class="Main">
  <img class="Main__logo" alt="Kecap Logo" src="/KecapLogo.svg">
  <div class="Main__content">
    <h1>Kecap</h1>
    <p>Keyboard-driven Carousel Component Provider</p>

    <div class="Main__buttons">
      <button class="Button Button--primary">Download</button>
      <button class="Button">Github</button>
    </div>
  </div>
</section>

<style>
  .Main {
    display: flex;
    align-items: center;
    justify-content: center;

    background: #f1f2f3;
    height: 80vh;
  }

  .Main__logo {
    height: 30vh;
    margin-right: 50px;
  }

  .Main__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #202020;
  }

  .Main__content h1 {
    font-family: 'Titillium Web', sans-serif;
    font-weight: 100;
    font-size: 5vw;
    margin: 0;
  }

  .Main__content p {
    margin-top: 5px;
    font-family: 'Fira Sans', sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
  }

  .Main__buttons {
    margin-top: 20px;
  }

  @media (max-width: 1024px) {
    .Main__content h1 {
      font-size: 3rem;
    }
  }
</style>
