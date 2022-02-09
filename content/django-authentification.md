---
title: Apprendre Django - L'authentification
intro: Comprenez le système d'authentification de Django pour mieux le modifier !

badge:
  link: "https://unsplash.com/@blackprojection?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
  name: "Max Letek"

img:
  name: rachmat-putro-restuaji-GthoQcLaUS0-unsplash.jpg
  alt: "Vieux Masque."

added: 09/03/2019
readTime: 17

tags: [Django, Authentification]
---

Le système d'authentification de Django est riche et complexe. S'il peut paraître déroutant pour le néophyte, il se révèle très puissant et maniable pour celui qui comprend le fonctionnement interne.

Dans ce tuto, nous nous concentrerons sur le système d'authentification par la fonction `authenticate` et les moteurs d'authentification.

Pour suivre ce cours dans de bonnes conditions, vous devez :

- Être à l'aise avec la Programmation Orientée Objet
- Savoir lancer une application Django
- Être à l'aise avec le système de vues et de templates Django
- Connaître l'ORM de Django et utiliser l'objet `User`
- Connaître les bases de l'authentification dans Django : authentifier un utilisateur et le déconnecter simplement

## Mettons en place le projet

Comme d'habitude, je vais partir d'un [template Django](https://github.com/code-and-code-fr/apprendre-django-authentification) prévu pour l'occasion.

Nous travaillerons avec Python `3.7` et Django `2.2`.

Démarrons notre aventure en important le projet de base :

```bash
git clone https://github.com/code-and-code-fr/apprendre-django-authentification.git # clonage du projet Github
cd apprendre-django-authentification # positionnement à la racine du projet
python -m venv ./.venv # création de l'environnement virtuel
source .venv/scripts/activate # activation de l'environnement virtuel - remplacer 'scripts' par 'bin' sous linux
pip install -r requirements.txt # installation des dépendances - django -
```

> En ce qui concerne les gestionnaires d'environnements virtuels : l'utilisation de venv peut changer d'un système d'exploitation à l'autre. Visionnez la documentation pour utiliser les commandes appropriées. Vous pouvez aussi utiliser [Pipenv](https://github.com/pypa/pipenv) ou [Poetry](https://github.com/sdispater/poetry). Dans ce projet, la seule dépendance est Django.

Super, nous pouvons maintenant visualiser le contenu de ce projet en tapant :

```bash
python manage.py migrate # migration des modèles de base de données
python manage.py add_user # commande de notre application 'login' - ajoute un utilisateur dans la base de données
python manage.py runserver # lancement du serveur
```

![Base du site](baseHome.jpg)

Nous avons accès à une page d'accueil, comprenant un formulaire de login et une phrase de bienvenue. Vous pouvez vous logger en tapant `bob` pour les identifiants et `pass` pour le mot de passe.
Une fois authentifié, vous serez redirigé vers la même page d'accueil. Le formulaire disparaît et un bouton logout remplace le bouton login. La phrase de bienvenue intègre maintenant votre pseudo d'utilisateur (`bob` dans notre exemple).

> Le code source possède une simple vue dans le fichier `./base/views.py` qui génère la page d'accueil. Une application `login` est aussi présente, et génère le template de login, ainsi que les vues de login et de logout.

Je sais ce que vous vous dites : c'est déjà magnifique. En effet que demander de plus ?
Et bien, je ne sais pas... Imaginons que bob préfère se connecter avec son **adresse email** plutot en plus de son pseudo ? Ou que vous préfériez demander un **jeton d'authentification**, plutôt que l'habituel pseudo/mot de passe ? Dans ce cas là il faudra toucher au système d'authentification de Django !

## Le système d'authentification : principes de base

Le système d'authentification dans Django est scindé en plusieurs parties, dont les principales, selon moi :

- le modèle `User`, qui représente les utilisateurs dans l'application
- les middlewares d'authentification, qui se chargent d'intégrer les données d'utilisateur dans chaque requête
- la fonction `authenticate`, qui va chercher un utilisateur en fonction des informations reçues
- les fonctions `login` et `logout` qui se chargent d'intégrer et d'enlever les données d'un utilisateur à la requête.

Viennent ensuite plusieurs autres fonctions, classes ou décorateurs qui ajoutent d'autres fonctionnalités à l'application.

Ce système se base donc sur le modèle `User` qui caractérise un utilisateur, dont les données sont sauvegardées dans la base de données. L'authentification intervient après l'enregistrement d'un utilisateur. Il s'agit donc pour un utilisateur de se connecter à l'application avec ses propres données.

### Création de l'utilisateur

Notre application possède un seul utilisateur (bob), créé via la [commande](https://docs.djangoproject.com/fr/2.2/howto/custom-management-commands/) `add_user` présente dans notre application `login`. Dans une application web classique, l'utilisateur s'enregistre depuis une page de formulaire spécifique.

### La connexion de l'utilisateur

Entrons maintenant dans le vif du sujet. Notre code contient une vue simple pour l'authentification, dont la quasi-totalité du code provient de [l'exemple donné dans la documentation officielle](https://docs.djangoproject.com/fr/2.2/topics/auth/default/#how-to-log-a-user-in) :

```python [login/views.py]
# ...

def user_login(request):
    """Authenticate a user."""
    # Etape 1 :
    username = request.POST["username"]
    password = request.POST["password"]

    # Etape 2 :
    user = authenticate(request, username=username, password=password)

    # Etape 3 :
    if user is not None:
        login(request, user)
        messages.add_message(request, messages.SUCCESS, "Vous êtes connecté !")
    else:
        messages.add_message(
            request, messages.ERROR, "Les champs renseignés sont invalides."
        )

    return redirect("home")

...
```

Dans cette vue, nous nous authentifions en 3 étapes :

1. nous commençons par récupérer les informations transmises par la requête de l'utilisateur (les champs `username` et `password`)
1. ensuite, nous appelons la fonction `authenticate`, qui va _tenter_ de trouver un utilisateur dans la base de données **en fonction des paramètres fournis**.
1. Enfin, si l'utilisateur a été trouvé, nous nous authentifions grâce à la fonction `login`, qui prend en paramètre notre objet `request` et un utilisateur, préalablement trouvé par `authenticate`.

Dans tous les cas dans notre code, nous redirigeons l'utilisateur vers la page d'accueil.

> Nous utilisons aussi le système de [messages](https://docs.djangoproject.com/fr/2.2/ref/contrib/messages/) pour informer l'utilisateur des changements effectués.

La partie frontend de l'authentification est elle aussi minimaliste :

```html
<!-- ./login/templates/login.html -->
...

<form method="post" action="{% url 'login' %}">
  {% csrf_token %}
  <div class="form-elem">
    <div>Nom d'utilisateur :</div>
    <input type="text" id="username" name="username" />
  </div>
  <div class="form-elem">
    <div>Mot de passe :</div>
    <input type="text" name="password" />
  </div>
  <div class="form-elem">
    <input class="logBtn" type="submit" value="Login" />
  </div>
</form>

...
```

Nous avons un simple formulaire avec deux champs, un pour le nom d'utilisateur, et un autre pour le mot de passe.

> Notez que nous n'utilisons pas les [formulaires de django](https://docs.djangoproject.com/fr/2.2/topics/forms/), par soucis de simplicité dans ce cours.

### La déconnexion de l'utilisateur

Cette partie est la plus simple, comme le prouve notre code :

```python
# ./login/views

...

def user_logout(request):
    logout(request)
    messages.add_message(request, messages.SUCCESS, "Vous êtes déconnecté !")
    return redirect("home")

...
```

La fonction `logout` se charge d'enlever les données d'utilisateur présentes dans l'objet `request`.

## La fonction authenticate : pièce maîtresse de l'authentification

Attardons nous sur la fonction `authenticate`, que je trouve personnellement très riche et intéressante ! C'est elle qui va vous permettre de créer des connexion spécifiques dans vos applications. Les plugins d'authentification via Google ou d'autres réseaux sociaux passent d'ailleurs par cette fonction.

Le but premier de cette fonction est de **trouver un utilisateur dans la base de données selon des informations transmises par l'utilisateur**.
Par exemple, quand nous entrons le pseudo `bob` et le mot de passe `pass` dans l'application, ces deux données sont transmises au serveur et passées en paramètres dans la fonction `authenticate`. Si la fonction parvient à trouver et valider un utilisateur à partir de ces données, alors l'authentification est réussie, il n'y à plus qu'à authentifier cet utilisateur avec la fonction `login`.

La fonction `authenticate` se base sur un système de classes dites `authentication_backends` qui sont des [moteurs d'authentification](https://docs.djangoproject.com/fr/2.2/topics/auth/customizing/#specifying-authentication-backends). Chacune de ces classes possède une méthode d'authentification, qui s'occupe de trouver un utilisateur dans la base de données. **Elle peut prendre les paramètres que vous souhaitez**.
C'est donc grâce à ces moteurs que vous pouvez remplacer l'authentification de base par une authentification via l'email, via un jeton ou même via Google.

Voici le code source de la fonction `authentication` :

```python
def authenticate(request=None, **credentials):
    """
    If the given credentials are valid, return a User object.
    """
    for backend, backend_path in _get_backends(return_tuples=True):
        try:
            inspect.getcallargs(backend.authenticate, request, **credentials)
        except TypeError:
            # This backend doesn't accept these credentials as arguments. Try the next one.
            continue
        try:
            user = backend.authenticate(request, **credentials)
        except PermissionDenied:
            # This backend says to stop in our tracks - this user should not be allowed in at all.
            break
        if user is None:
            continue
        # Annotate the user object with the path of the backend.
        user.backend = backend_path
        return user

    # The credentials supplied are invalid to all backends, fire signal
    user_login_failed.send(sender=__name__, credentials=_clean_credentials(credentials), request=request)
```

Le code est bien documenté, mais pour le décrire simplement : la fonction appelle chaque _moteur d'authentification_ un à un, jusqu'à trouver celui qui va récupérer un utilisateur dans la base de données _en fonction des paramètres fournis_.
Si un utilisateur est trouvée, la fonction retourne cet utilisateur. Sinon, elle retourne `None`.

> pour une description plus détaillée, [cliquez ici](https://docs.djangoproject.com/fr/2.2/topics/auth/default/#django.contrib.auth.authenticate).

### Le moteur d'authentification : notre prochain jouet

Nous allons maintenant nous intéresser aux moteurs d'authentification. Ces moteurs sont des classes Python qui acceptent au moins deux méthodes :

- `get_user`, qui prend en paramètre un attribut de `User` comme identifiant. Cette méthode ne nous servira pas directement, elle est utilisée dans les middlewares pour récupérer l'utilisateur à chaque requête.
- `authenticate`, qui prend en paramètre les informations que vous souhaitez pour récupérer un utilisateur en base de données. C'est cette méthode qui nous intéresse.

Visionnons le backend intégré par défaut dans django, qui se trouve dans `django.contrib.auth.backends.ModelBackend` :

```python
from django.contrib.auth import get_user_model

 ...

UserModel = get_user_model() # récupère l'objet User même s'il a été modifié

class ModelBackend:
    """
    Authenticates against settings.AUTH_USER_MODEL.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        try:
            user = UserModel._default_manager.get_by_natural_key(username)
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            UserModel().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user

    def user_can_authenticate(self, user):
        """
        Reject users with is_active=False. Custom user models that don't have
        that attribute are allowed.
        """
        is_active = getattr(user, 'is_active', None)
        return is_active or is_active is None
    ...

    def get_user(self, user_id):
        try:
            user = UserModel._default_manager.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
        return user if self.user_can_authenticate(user) else None
```

> J'ai enlevé les méthodes qui traitent sur les permissions, car ce n'est pas le sujet de notre article. Si vous souhaitez en savoir plus sur ces méthodes, [c'est ici](https://docs.djangoproject.com/fr/2.2/topics/auth/customizing/#handling-authorization-in-custom-backends).

La méthode `get_user` sera la même dans les moteurs que nous utiliserons. La méthode `authenticate` peut par contre sembler complexe au premier abord :

- La première condition permet de trouver un équivalent de `username`, si le modèle `User` a été modifié
- Ensuite, nous avons un bloc `try/except` où l'on tente de récupérer l'utilisateur avec son `username`
  - si l'utilisateur n'existe pas, la fonction de hashage de mot de passe est quand même appelée pour des raisons de sécurités
  - Si l'utilisateur existe, une condition va vérifier le mot de passe et le statut `is_active` de l'utilisateur (une fonctionnalité qui permet de créer une vérification par email, par exemple). Si cette condition passe, la méthode retourne l'utilisateur
- Si une des conditions ne passe pas, la méthode retourne `None`

Ce qu'il faut retenir de cette méthode, c'est qu'elle prend un nom d'utilisateur et un mot de passe pour ensuite tenter de retrouver un utilisateur (et s'assurer que le mot de passe convient).

### Créons maintenant notre propre moteur d'authentification

L'intérêt d'un tel système est de nous permettre d'implémenter notre propre type d'authentification, et ce assez rapidement.

Dans notre cas, nous souhaitons implémenter l'authentification avec un email et un mot de passe. Voici à quoi pourrait ressembler la méthode `authenticate` de notre moteur d'authentification :

```python
def authenticate(self, request, email=None, password=None, **kwargs):
    if email is None:
        email = kwargs.get(UserModel.EMAIL_FIELD)
    try:
        user = UserModel.objects.get(email=email)
    except UserModel.DoesNotExist:
        # Run the default password hasher once to reduce the timing
        # difference between an existing and a nonexistent user (#20760).
        UserModel().set_password(password)
    else:
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
```

Nous avons simplement changé le paramètre `username` par `email`. Nous suivons ensuite la logique de base de la méthode. Nous aurions pus faire encore plus simple :

```python
def authenticate(self, request, email=None, password=None, **kwargs):
    try:
        user = UserModel.objects.get(email=email)
    except UserModel.DoesNotExist:
        pass
    else:
        if user.check_password(password):
            return user
```

Le code est plus clair, mais nous perdons les mesures de sécurité et de compatibilité mises en place par Django.

Implémentons maintenant notre classe d'authentification :

```bash
# dans votre terminal :
touch login/authenticate.py
```

```python
# login/autenticate.py

from django.contrib.auth import get_user_model


UserModel = get_user_model() # récupère l'objet User même s'il a été modifié ailleurs

class EmailAuth:
    """
    Email authentication.
    """

    def authenticate(self, request, email=None, password=None, **kwargs):
        if email is None:
            email = kwargs.get(UserModel.EMAIL_FIELD)
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            UserModel().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user

    def user_can_authenticate(self, user):
        """
        Reject users with is_active=False. Custom user models that don't have
        that attribute are allowed.
        """
        is_active = getattr(user, "is_active", None)
        return is_active or is_active is None

    def get_user(self, user_id):
        try:
            user = UserModel._default_manager.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
        return user if self.user_can_authenticate(user) else None
```

Il faut ensuite dire à Django que nous souhaitons utiliser ce moteur d'authentification :

```python
# ./base/settings.py

...

# Authentication
# https://docs.djangoproject.com/fr/2.2/ref/settings/#authentication-backends

AUTHENTICATION_BACKENDS = ["login.authenticate.EmailAuth", ]
```

Si nous essayons de nous connecter, nous constatons que nos identifiants ne fonctionnent plus. C'est normal, il faut maintenant spécifier l'email !
L'email de bob est `foo@example.com`. Mais pour spécifier cet email, il faut aussi changer les champs de notre formulaire, et leur récupération dans notre vue `user_login`. Remplacez le champ du nom d'utilisateur par celui ci :

```html
<!-- login/templates/login.html -->
...
<div class="form-elem">
  <div>Adresse email :</div>
  <input type="text" id="email" name="email" />
</div>
...
```

et modifiez la vue `user_login` :

```python {6,10}
# login/views.py

def user_login(request):
    """Authenticate a user."""
    # Etape 1 :
    email = request.POST["email"]  # <- changement
    password = request.POST["password"]

    # Etape 2 :
    user = authenticate(request, email=email, password=password)  # <- changement

    # Etape 3 :
    if user is not None:
        login(request, user)
        messages.add_message(request, messages.SUCCESS, "Vous êtes connecté !")
    else:
        messages.add_message(
            request, messages.ERROR, "Les champs renseignés sont invalides."
        )

    return redirect("home")
```

Vous pouvez maintenant tester l'authentification avec l'email.

### Cumuler les moteurs d'authentification

Vous remarquerez qu'on ne peut plus s'authentifier avec le nom d'utilisateur. Dans l'idéal, nous aimerions laisser le choix à l'utilisateur de s'authentifier avec son nom d'utilisateur, ou son email. Et bien, c'est justement dans cet esprit que la structure des moteurs d'authentification est conçue : nous pouvons cumuler les moteurs d'authentification !

Rajoutons simplement le moteur de base dans notre variable `AUTHENTICATION_BACKENDS` :

```python
# ./base/settings.py

...

# Authentication
# https://docs.djangoproject.com/fr/2.2/ref/settings/#authentication-backends

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "login.authenticate.EmailAuth",
]
```

N'oublions pas de modifier le champs `email` de notre template `login.html` :

```html
<!-- ./login/templates/login.html -->
...

<div class="form-elem">
  <div>Adresse email ou nom d'utilisateur :</div>
  <input type="text" id="email-or-username" name="email-or-username" />
</div>

...
```

Et finalement notre vue `user_login` :

```python
# ./login/views.py

def user_login(request):
    """Authenticate a user."""
    # Etape 1 :
    email = username = request.POST["email-or-username"]  # <- changement
    password = request.POST["password"]

    # Etape 2 :
    user = authenticate(request, email=email, username=username, password=password) # <- changement

    # Etape 3 :
    if user is not None:
        login(request, user)
        messages.add_message(request, messages.SUCCESS, "Vous êtes connecté !")
    else:
        messages.add_message(
            request, messages.ERROR, "Les champs renseignés sont invalides."
        )

    return redirect("home")
```

Nous pouvons maintenant nous connecter avec le nom d'utilisateur ou l'adresse email.

Il reste cependant un problème à régler : **le champ d'utilisateur `email` n'est pas unique**. Si un autre utilisateur décide d'utiliser la même adresse email que bob lors de son enregistrement, ni bob, ni cet utilisateur pourront se connecter ! En effet, lors de la récupération de l'utilisateur, l'ORM ne saura pas quel utilisateur choisir entre les deux et renverra une erreur.

## Personnalisation du modèle User

Pour éviter celà, nous allons définir un [modèle d'utilisateur personnalisé](https://docs.djangoproject.com/fr/2.2/topics/auth/customizing/#substituting-a-custom-user-model). Le problème qui se pose lorsque nous changeons de modèle d'utilisateur en cours de route, c'est que le système de migrations de données est complètement chamboulé. Dans le cadre de ce cours, ce n'est pas grave, nous allons simplement supprimer le fichier `./db.sqlite3`. Mais je vous recommande fortement de définir un modèle d'utilisateur personnalisé à chaque début de projet, **avant toute migration**.

Définissons notre modèle dans notre application `login` :

```python
# ./login/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    email = models.EmailField(_("email address"), blank=True, unique=True) # L'adresse email est rendue unique

```

Cette classe hérite de `AbstractUser` qui reprend tous les attributs du model `User` de base.

Spécifions à Django que nous souhaitons utiliser cette classe plutot que celle de base :

```python
# ./base/settings.py

...

AUTH_USER_MODEL = 'login.User' # cette variable pointe sur le modèle User à utiliser
```

> C'est en redéfinissant le modèle `User` que la fonction [get_user_model](https://docs.djangoproject.com/fr/2.2/topics/auth/customizing/#django.contrib.auth.get_user_model) prend tout son sens. Elle permet de récupérer le modèle spécifié dans la variable `AUTH_USER_MODEL`. Evitez d'importer le modèle de base si vous utilisez le votre !

Maintenant, tapez ces lignes de votre terminal :

```bash
rm db.sqlite3 # suppression de notre base de données
python manage.py makemigrations # prise en compte de notre modèle User
python manage.py migrate # migration des données
python manage.py add_user # nous recréons notre utilisateur bob
```

Vous pouvez relancer l'application avec la commande `python manage.py runserver`. Le email est maintenant unique. Nous pouvons le vérifier en recréant un utilisateur avec la commande `python manage.py createsuperuser`. Si nous renseignons l'adresse email `foo@example.com`, une erreur de duplication surviendra.

Nous arrivons à la fin de ce tutoriel, et vous devez maintenant avoir les bases pour modifier sereinement votre modèle `User`, et intégrer votre propre système d'authentification.

A très bientôt sur le site !
