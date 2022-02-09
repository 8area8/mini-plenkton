---
title: Bocadillo - Introduction sur ce framework asynchrone
intro: Créons une application web de messagerie instantanée avec Bocadillo et le protocole WebSocket.

img:
  name: flavio-amiel-kg11HbuQ5nU-unsplash.jpg
  alt: "Boîte aux lettres avec gravure"

badge:
  link: "https://unsplash.com/@justmekirsty?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
  name: "Reza Rostampisheh"

added: 09/09/2019
tags: [Python, Asynchrone]
---

Il y a un moment que je voulais tester ce framework (basé sur le framework ASGI [starlette](https://www.starlette.io/)), et du coup j'en ai profité pour en faire un tuto en parallèle. :)

Dans le cadre de ce cours, nous mettrons en place une application Bocadillo **à partir de zéro**. Cette application servira un système de messagerie instantannée. Elle sera basée sur la célèbre bibliothèque [socket.io](https://socket.io/) de Javascript.

Nous allons utiliser `python 3.7` et `bocadillo 0.18`.

Pour bien comprendre cet article, vous devez être capable de :

- lancer un serveur web avec Flask ou Django
- comprendre un peu le fonctionnement d'un framework web (ORM, templates, vues/routes...)

## Bocadillo, c'est quoi ce truc

![Base du site.](bocadillo.jpg)

Et bien hors Python, le bocadillo est un sandwich espagnol.

Mais dans l'écosystème de Python, [Bocadillo](https://bocadilloproject.github.io/guide/#about-this-website) est un framework python qui sert à créer des applications web **asynchrones**.

Ce qui est génial avec ce framework, c'est qu'il possède une documentation officielle archi-propre. Franchement, quand c'est beau comme ça, on a qu'une envie, c'est de tester leur techno. Au moins pour leur rendre honneur.

> Pour tout vous dire, ce cours a surtout l'avantage d'être écrit en français et de synthétiser pas mal de notions. Sinon, [leur tutoriel](https://bocadilloproject.github.io/guide/tutorial.html) est assez claire pour que vous puissiez tout comprendre.

Dans la pratique le code est vraiment bien foutu. L'API est agréable à utiliser et on arrive à faire ce qu'on veut assez facilement.

### Serveur web synchrones et asynchrones

Un serveur web synchrone a tendance à utiliser un thread par utilisateur. Ce système se révèle assez coûteux en ressources. Chaque requête est dite "bloquante", c'est à dire que le thread en question attend la fin du traitement du serveur avant de retourner la réponse.

Un serveur asynchrone va se baser sur la programmation asynchrone. Dans ce type de programmation, chaque fonction renvoit une réponse **avant de finir le traitement**. Le traitement se fait en arrière plan et sera ensuite retourné une fois terminé. L'intérêt d'un tel serveur est de pouvoir gérer des centaines/milliers de requêtes **sur un seul thread**, ce qui le rend beaucoup plus rapide.

Dans le cadre du web, l'asynchrone permet d'accéder à des protocoles très réactifs comme le [WebSocket](https://fr.wikipedia.org/wiki/WebSocket), que nous utiliserons dans ce cours.

> Python possède une norme pour les serveurs HTTP appelée [WSGI](https://fr.wikipedia.org/wiki/Web_Server_Gateway_Interface). Cette norme, qui est utilisée par presque tous les frameworks web Python synchrones, permet de **transformer les requêtes en objets Python, et les objets Python en requêtes**. Avec le développement des serveurs asynchrones, la norme [ASGI](https://channels.readthedocs.io/en/latest/asgi.html) est apparue, et permet de faire la même chose que la norme WSGI, mais en utilisant la programmation asynchrone et en implémentant de nouveaux protocoles, dont le protocole WebSocket.

### CPU-bound ou I/O-bound

Encore deux notions importantes à savoir, et j'arrête de vous embêter avec mon préambule. ;)

Le terme I/O (ou [entrées/sorties](https://fr.wikipedia.org/wiki/Entr%C3%A9es-sorties)) désigne le fait de transférer des données vers un ordinateur ou depuis un ordinateur. Dans le web, l'I/O se caractérise dans l'envoi et la reception des requêtes http ou encore de requêtes vers la base de données. Un code I/O-bound est un code dont le temps de traitement est dépendant des entrées/sorties.

Le CPU se réfère au [processeur](https://fr.wikipedia.org/wiki/Processeur). Les programmes CPU-bound sont des programmes dont le temps de traitement est lié à la rapidité du processeur (des traitements à base de calculs lourds par exemple).

Il est important de faire la distinction entre ces deux types de traitements, dans le but de mieux penser son application asynchrone. Si votre traitement est _CPU-bound_, alors l'asynchrone **ne vous servira à rien**. Il faudra réfléchir à une autre solution (un nouveau thread ou un nouveau processus).

### Asyncio en plus simple

Sous le capôt, Bocadillo utilise les coroutines avec Asyncio. Cette technologie demande un temps d'apprentissage et n'est pas totalement intuitive. Et ça, Bocadillo l'a bien comprit et nous offre un système qui **simplifie grandement l'utilisation d'asyncio**. Comprenez par là que vous n'aurez pas besoin de connaître les méthodes propres à asyncio pour utiliser ce framework. :)

Pour reprendre leurs mots :

> As an async web framework, Bocadillo provides an asynchronous runtime and takes care of running coroutines for you. This allows you to write async/await code without worrying about who runs it and how.
>
> - [source](https://bocadilloproject.github.io/guide/async.html#working-with-coroutines)

Ce qui veut dire que la plupart du temps, vous aurez juste à écrire `async` devant vos fonctions, et `await` pour spécifier le retour. Bocadillo se chargera du reste. Voici l'exemple du `hello world` :

```python
from bocadillo import App, configure

app = App()
configure(app)

@app.route("/")
async def hello(req, res):
    res.text = "Hello, world!"
```

On se croirait dans Flask, mais avec des `async` devant nos routes. :)

### Si tu fais de l'async', assures toi d'être full async'

Tout est dit : faites bien attentions à utiliser des **fonctions non bloquantes** dans vos routes sinon vous cassez le système asynchrone de votre application. La documentation de Bocadillo nous donnes des [liens de bibliothèques non bloquantes](https://bocadilloproject.github.io/guide/async.html#finding-async-libraries-to-replace-synchronous-ones) comme :

- [databases](https://github.com/encode/databases) : l'équivalent asynchrone de [SQLAlchemy](https://www.sqlalchemy.org/)
- [requests-async](https://github.com/encode/requests-async) : l'équivalent asynchrone de [requests](https://2.python-requests.org/en/master/)

Il existe aussi des méthodes pour [garder le processus asynchrone sur des traitements de type _CPU-bound_](https://bocadilloproject.github.io/guide/async.html#common-patterns). En gros on met tout le bazard dans des threads pour éviter d'attendre pendant le traitement. :)

Enfin, la documentation officielle est tellement cool qu'elle nous donne une tonne d'infos et de liens utiles [à la fin de cette page](https://bocadilloproject.github.io/guide/async.html), qui résume tout le processus asynchrone.

## On démarre tout ça

Oui, c'est bon, mon intro est terminée. Nous pouvons démarrer un nouveau projet :

```bash
mkdir bocadillo-introduction && cd $_ # création du dossier et déplacement à sa racine

# création de l'environnement virtuel :
py -3.7 -m venv ./.venv # sous Window
python3.7 -m venv ./.venv # sous Linux/Mac

# activation de l'environnement virtuel :
C:\\{chemin du .venv}\\Scripts\\activate.bat # sous Windows avec cmd
source .venv/Scripts/activate # sous Windows avec 'Bash for Windows'
source .venv/bin/activate # sous Linux/Mac
```

L'environnement virtuel étant activé, nous pouvons installer les bibliothèques necessaires :

```bash
pip install bocadillo # installation de Bocadillo
pip install bocadillo-cli # installation de bocadillo-cli
```

> Bocadillo-cli est un outil de management de projets (un peu comme [django-admin](https://docs.djangoproject.com/fr/2.2/ref/django-admin/) pour Django).

Bocadillo est basé sur [Starlette](https://github.com/encode/starlette) et utilise [Uvicorn](https://www.uvicorn.org/) (l'équivalent ASGI de [Gunicorn](https://gunicorn.org/)). Parmi ses dépendances, nous pouvons aussi trouver le moteur de templates [Jinja2](https://jinja.palletsprojects.com/en/2.10.x/) et le gestionnaire de fichiers statiques [Whitenoise](http://whitenoise.evans.io/en/stable/). Ce framework se veut aussi minimaliste que Flask, et il vous faudra donc le compléter avec les bibliothèques souhaitées.

Initialisons le projet :

```bash
bocadillo create -d . base # création du projet dans le répertoire courant
```

Cette commande va créer un fichier `readme.md` ainsi qu'un dossier que j'ai sobrement nommé `base`, qui contient les modules cores d'un projet Bocadillo. Dans ce cours, nous nous concentrerons spécifiquement sur le fichier `./base/app.py`. Tout notre code serveur tiendra dedans (entre autre parce qu'il sera ridiculement petit !).

Vous pouvez dès maintenant remplacer le contenu du fichier `app.py` par ceci :

```python
# ./base/app.py

"""Application definition."""
from bocadillo import App, Templates


app = App()
templates = Templates()


@app.route("/")
async def index(request, response):
    response.html = await templates.render("index.html")
```

Le code se lit en trois étapes :

- Nous importons certains modules fournis par Bocadillo
- Nous initialisons l'application et le moteur de templates.
- Nous créons notre première route qui sert la page d'accueil. Nous utilisons `async` devant le mot clé `def` pour stipuler que c'est une fonction asynchrone. L'objet `response` va ensuite retourner le template `index.html` lorsqu'il sera chargé. Le mot clé `await` permet de spécifier cette attente, de façon asynchrone.

Nous importons un template `index.html`, mais il faut encore le créer :

```bash
mkdir templates
touch templates/index.html
```

Un des comportements par défaut de Bocadillo est de rechercher automatiquement les templates présents dans le dossier `templates` à la racine du projet.

```html
<!-- ./templates/index.html -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Chat | Bocadillo + socket.io</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" type="text/css" href="/static/styles.css" />
  </head>

  <body>
    <ul id="messages"></ul>
    <form id="form" action="">
      <input id="message" autocomplete="off" /><button>Send</button>
    </form>
  </body>
</html>
```

Ce template est constitué d'une liste vide qui va sotcker les messages à venir. Il possède aussi un formulaire basique qui permet d'écrire un message pour ensuite l'envoyer.

Nous pouvons remarquer qu'il appel un fichier `styles.css`. Nous allons donc le créer :

```bash
mkdir static
touch static/styles.css
```

Un autre comportement par défaut de Bocadillo : il sert automatiquement les fichiers présents dans le dossier `static`, si ce dernier est situé à la racine du projet.

> "Servir" un fichier statique veut dire qu'on le met à disposition du client. Ce dernier peut alors le récupérer en pointant sur son emplacement dans le serveur. Dans notre exemple, le fichier `styles.css` devient accessible en tapant `http://127.0.0.1:8000/static/styles.css` lorsque le serveur local est lancé.

Ajoutons notre CSS :

```css
/* static/styles.css */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font: 13px Helvetica, Arial;
}

form {
  background: #eeeeee;
  padding: 2em;
  position: fixed;
  bottom: 0;
  width: 100%;
}

form input {
  border: 0;
  padding: 10px;
  width: 90%;
  margin-right: 0.5%;
}

form button {
  width: 9%;
  background: rgb(63, 124, 144);
  border: none;
  padding: 10px;
  color: white;
  font-weight: bold;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-bottom: 5em;
}

#messages li {
  padding: 2em;
  background-color: #e0e0e0;
  border-radius: 3px;
  font-size: 1.5em;
  color: #353535;
  width: 50%;
  margin: auto;
  margin-top: 2em;
}

#messages li:nth-child(odd) {
  background: #eee;
}

#messages li:last-child {
  margin-bottom: 6em;
}
```

Nous avons le minimum pour faire tourner l'application, vous pouvez l'essayer en tapant `uvicorn base.asgi:app --reload`. Uvicorn va récupérer l'objet `app` situé dans le fichier `./base/asgi.py`, et lancer le serveur. Le paramètre `--reload` permet le rechargement automatique du serveur lorsque vous effectuez une modification. Visionnez votre application, en allant au [http://127.0.0.1:8000](http://127.0.0.1:8000) :

![Base du site.](baseBocadillo.jpg)

## Des échanges instantanés avec le protocole WebSocket

La page est servie mais on ne peut toujours pas poster de messages. Et justement, c'est l'heure de s'en occuper !

Je vous ai déjà parlé du protocole WebSocket plus haut. Ce protocole va créer une communication **dans les deux sens**, entre le serveur et les clients. C'est comme un tunnel spécial entre le client et le serveur, ou chacun peut s'échanger des informations en continue et sans attente.

Dans notre application, ce protocole permettra d'envoyer et de recevoir des messages en continue avec une écoute constante du serveur. C'est beaucoup plus pratique et performant que d'utiliser les requêtes HTTP à intervals réguliers, dans le but de mettre à jour le client par rapport au serveur (technique du [polling](https://davidwalsh.name/javascript-polling)).

> Pour en savoir plus sur le protocole WebSocket, [c'est ici](https://fr.wikipedia.org/wiki/WebSocket).

### Socket.io, la bibliothèque du WebSocket

Socket.io est une bibliothèque qui implémente le websocket très facilement. L'API est élégante et facile à comprendre, et c'est pour cette raison qu'elle est si répandue.

Ce protocole s'implémente avec une bibliothèque côté client et une autre côté serveur. Une fois connectés, les clients et le serveur seront en **écoute constante sur un ou plusieurs évènements !**

### L'implémentation chez Python

```bash
pip install python-socketio # installation de socketio pour python
```

Cette bibliothèque reprend l'interface de `socket.io`, adaptée à Python. Nous allons maintenant modifier notre fichier `app.py` :

```python
"""Application definition."""
from bocadillo import App, Templates

import socketio # ajout


app = App()
templates = Templates()

# Initialisation du serveur WebSocket.
sio = socketio.AsyncServer(async_mode="asgi")
app.mount("/sio", socketio.ASGIApp(sio))


@app.route("/")
async def index(request, response):
    response.html = await templates.render("index.html")


# Ajout de l'évènement WebSocket "message".
@sio.on("message")
async def broadcast(sid, data: str):
    print("message:", data)
    await sio.emit("response", data)
```

Notre code a subit plusieurs changements :

- nous importons la bibliothèque `socketio`
- nous assignons un serveur WebSocket dans la variable `sio`
- nous enrobons ce serveur dans notre application Bocadillo avec la méthode `app.mount`
- nous ajoutons à la fin, un évènement controlé par le serveur Webosocket.

Attardons nous sur cet évènement.

Il démarre avec un décorateur `sio.on` :

```python
@sio.on("message")
```

`sio` est la variable contenant le serveur WebSocket, et `on`, sa méthode permettant de définir un évènement. Cette méthode prend un argument, qui est le nom de l'évènement. Nous avons donc définit l'évènement `message`.

passons à la signature de la fonction `broadcast` :

```python
async def broadcast(sid, data: str):
```

Cette fonction possède deux paramètres. le premier est `sid`, une abréviation de "session id". C'est l'identifiant de session communiqué par le protocole WebSocket.
Le deuxième est `data`. Ce paramètre représente la donnée transmise au serveur. C'est un peu l'équivalent d'une requête `POST`, on intéragie avec le serveur en lui passant des informations.

Enfin, le corps de la fonction :

```python
    print("message:", data)
    await sio.emit("response", data)
```

Un simple `print` pour le débug, et une réponse aux clients connectés avec la méthode `sio.emit`. La méthode `emit` envoi un évènement spécifique aux clients connectés à cet évènement. Ses deux paramètres sont le nom de l'évènement, et la donnée renvoyée. Nous émettons donc un évènement `response`. La donnée est celle que la fonction `broadcast` a reçue depuis l'évènement `message`. ;)

Pour synthétiser, nous avons une fonction qui récupère les messages d'utilisateurs grâce à l'évènement `message`. Une fois récupérés, ils seront retransmis à ces utilisateur via l'évènement `response`. **Le but étant de récupérer chaque message de chaque utilisateur pour les retransmettre à tous les utilisateurs**.

### L'implémentation chez Javascript

L'implémentation côté serveur est finie, nous pouvons maintenant nous attarder sur l'implémentation côté client.

Parce que nous aimons faire les choses bien, nous allons installer la bibliothèque `socket.io` côté front avec le gestionnaire de packages `NPM`. Je vous laisse vous renseigner sur[ son installation en fonction de votre OS](https://nodejs.org/en/download/).

> Je vous recommande vivement de vous familiariser avec NPM, c'est un outil indispensable dans le développement web.

Une fois l'installation faite, vous pouvez initialiser un environnement NPM à la racine du projet :

```bash
npm init -y # Initialisation de l'environnement NPM
npm install socket.io # installation de notre bibliothèque
```

Vous devriez avoir un fichier `packages.json` et un dossier `node_modules`. Le premier sert à la gestion de l'environnement NPM, et le deuxième stock les dépendances de Node.js, et les bibliothèques installées par nos soins. La bibliothèque `socket.io` est d'ailleurs présente dans ce dossier.

Nos clients auront besoin d'accéder à cette bibliothèque. Nous allons donc la servir grâce à la fonction `static` :

```python
# ./base/app.py

from bocadillo import App, Templates, static # ajout de 'static'

...

app.mount("/socket.io", static("node_modules/socket.io-client/dist"))

...
```

Nous importons la fonction `static`, qui créée un serveur de fichiers statiques récupérés depuis un dossier spécifique, et nous utilisons `app.mount` pour incorporer ce serveur depuis le chemin `/socket.io`.

Maintenant que nous avons accès à notre bibliothèque `socket.io`, nous pouvons l'importer dans notre frontend :

```html
<!-- ./templates/index.html -->

...

<body>
  ...

  <script src="/socket.io/socket.io.js"></script>
</body>
```

Et nous pouvons maintenant utiliser l'objet `io` fournit par la bibliothèque `socket.io`. Initialisons le protocole côté client avec ce code :

```html
<!-- ./templates/index.html -->

...

    <script>
        const socket = io({
            path: "/sio/socket.io"
        });

        socket.on("connect", () => {
            console.log("Connected!");
        });
        socket.on("disconnect", () => {
            console.log("Lost connection to the server.");
        });
    </script>
</body>
```

Nous initialisons le socket avec l'objet `io`. Ce dernier prend un paramètre, qui est le chemin de notre serveur Websocket côté Python. Nous créons ensuite deux évènements simples. La méthode `on` de la variable `socket` fonctionne comme pour l'implémentation Python, c'est à dire qu'elle écoute les évènements. Dans notre cas, nous écoutons les évènements **à la connexion** et **à la déconnexion**, pour envoyer un message de debug en console.

Si nous nous connectons, nous constatons dans la console la réussite de la connexion :

![Message de connexion.](bocadilloConnected.jpg)

C'est beau. :')

Mais ce n'est pas fini. Il nous reste maintenant à envoyer et réceptionner les messages côté client. Ajoutez ce code à la fin de votre script :

```html
<!-- ./templates/index.html -->

...

<script>

  ...

  const formEl = document.getElementById("form");
  const messageEl = document.getElementById("message");
  const messageList = document.getElementById("messages");

  formEl.onsubmit = event => {
      event.preventDefault();
      socket.emit("message", messageEl.value);
      messageEl.value = "";
      return false;
  };

  socket.on("response", message => {
      console.log("response:", message);
      const li = document.createElement("li");
      li.innerText = message;
      messageList.appendChild(li);
      window.scroll(0, messageList.scrollHeight)
  });
</script>
```

Ici, nous faisons trois choses :

- nous récupérons les éléments du DOM qui nous seront utiles (le formulaire, l'input du formulaire et la liste qui va afficher les messages)
- nous créons un évènement lorsque nous soumettons le formulaire : lors de la soumission, la valeur contenu dans l'input est envoyé au serveur via l'évènement `message`.
- nous réceptionnons les messages en écoutant l'évènement `response`. Lorsqu'un message arrive, nous construisons un élément `li` qui va contenir le message. Nous insérons ensuite cet élément dans notre liste HTML.

J'ai le plaisir de vous annoncer que l'implémentation est terminée ! Faisons un test : ouvrons deux navigateurs ou plus, et connectons nous au serveur local. Si nous envoyons des messages dans un navigateur ou l'autre, nous constatons que les messages en question s'affichent dans tous les navigateurs de manière instantannée :

![Test du websocket.](testWebsocket.jpg)

L'implémentation de la messagerie est maintenant terminée. Il reste beaucoup à voir sur Bocadillo, mais nous avons déjà une base intéressante pour travailler dessus.

J'espère que le framework vous aura plu, et n'hésitez pas à me donner votre avis dans les commentaires. ;)
