---
title: Authentifiez vous via Google avec Django
intro: Mettons en place le protocole Oauth2 qui permet l'authentification depuis des applications externes comme Google ou Facebook !

badge:
  link: "https://unsplash.com/@rezarp?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
  name: "Reza Rostampisheh"

img:
  name: mitchell-luo-jz4ca36oJ_M-unsplash.jpg
  alt: "Des petits avions en papier aux couleurs de Google."

added: 08/27/2019
tags: [Python, Django]
---

Si vous souhaitez mettre en place une authentification simplifiée qui passe par Google, vous êtes au bon endroit.

Mon but va être de vous donner un exemple d'implémentation d'une bibliotèque Oauth2 avec Django, et ce de manière _très conçise_ !

## Mettons en place notre projet Django

Nous travaillerons avec `Python 3.7` et `Django 2.2`.

Pour ce tutoriel, vous devez au moins connaître les bases de Django. Nous allons prendre un [template Django](https://github.com/code-and-code-fr/django-oauth) créé pour l'occasion. Tapez dans votre Shell favori :

```bash
git clone https://github.com/code-and-code-fr/django-oauth.git # clonage du template Django
cd django-oauth # déplacement vers la racine du projet
python -m venv ./venv # création de l'environnement virtuel
source .venv/scripts/activate # activation de l'environnement virtuel
pip install -r requirements.txt # installation des dépendances (Django dans notre cas)
```

> si la création ou l'activation de l'environnement virtuel ne fonctionne pas, revoyez la [doc de venv](https://docs.python.org/fr/3.8/library/venv.html) pour coupler l'outil avec votre environnement, ou utilisez d'autres outils comme [Pipenv](https://github.com/pypa/pipenv). Remplacer `scripts` par `bin` peut parfois régler le problème, s'il existe.

Admirez l'installation de votre environnement virtuel le temps d'une gorgée de thé. Puis continuez avec :

```bash
python manage.py migrate # lancement des migrations de base de données. Django utilise par défaut SQLite.
python manage.py runserver # lancement du serveur local Django.
```

Le serveur tourne, et nous pouvons visionner notre site à l'adresse [http://127.0.0.1:8000/](http://127.0.0.1:8000/) :

![Base du site.](base.jpg)

Nous apercevons un [bouton de connexion Google](https://codepen.io/davidelrizzo/pen/vEYvyv) inactif et une phrase qui detecte si l'utilisateur est authentifié.
En plus des fichiers automatiquement créés par [l'instruction `startproject`](https://docs.djangoproject.com/fr/2.2/ref/django-admin/#django-admin-startproject) de Django, nous avons simplement défini un template `./base/templates/base.html`, directement servi par une [TemplateView](https://docs.djangoproject.com/fr/2.2/ref/class-based-views/base/#django.views.generic.base.TemplateView) présente dans le fichier `./base/urls.py`.

> L'exemple étant minimaliste, l'organisation de ce code n'est pas adaptée aux gros projets.

## Oauth2, notre nouvel ami

Oauth2 est la version 2 d'un framework (Oauth) qui permet la communication des données entre différentes applications tierce via le protocole HTTP. L'accès aux données d'un utilisateur passe toujours par une demande d'autorisation.
C'est grâce à cette technologie que vous pouvez vous inscrire et vous connecter à une application web par le biais de Google, Facebook, Github...

> Pour en savoir plus sur Oauth2, [c'est ici](https://zestedesavoir.com/articles/1616/comprendre-oauth-2-0-par-lexemple/) !

### Installation de Oauth2

Passons maintenant au concret. Django possède un plugin pour intégrer facilement Oauth2 : [social-auth-app-django](https://python-social-auth-docs.readthedocs.io/en/latest/configuration/django.html), une branche de la biliothèque `python social auth` :

```bash
source .venv/scripts/activate # activation de l'environnement virtuel
pip install social-auth-app-django # installation de notre bibliothèque
```

Il faut maintenant insérer notre plugin dans l'application Django :

```python
# settings.py

INSTALLED_APPS = (
    ...
    # thrid part applications
    'social_django',
)
```

Et aussi migrer notre base de données, pour prendre en compte les nouveaux modèles de ce plugin :

```bash
# Dans notre shell
python manage.py migrate
```

Nous ajoutons ensuite les chemins relatifs à ce plugin dans notre fichier `./base/urls.py` :

```python
from django.contrib import admin
from django.urls import path, include # importation de la fonction 'include'

from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", TemplateView.as_view(template_name="base.html")),
    path("", include("social_django.urls", namespace="social")), # nouvelle ligne
]
```

Puis nous ajoutons deux [_context processors_](http://www.formation-django.fr/framework-django/zoom-sur/context-processor.html), qui injectent des variables necessaires dans nos templates :

```python
# settings.py

...

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": ["./base/templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "social_django.context_processors.backends", # nouvelle ligne
                "social_django.context_processors.login_redirect", # nouvelle ligne
            ]
        },
    }
]

...
```

La configuration du plugin `social_django` est terminée. Notre prochaine étape sera d'ajouter des [_authentication backends_](https://docs.djangoproject.com/fr/2.2/topics/auth/customizing/) (Google, Facebook, Twitter...) à notre application !

### L'authentification avec Google

Entre nous, je ne porte pas vraiment Google dans mon coeur. Mais force est de constater que c'est la façon la plus simple et la plus fiable pour s'inscrire et s'authentifier rapidement aujourd'hui.

Dans tous les cas, vous pourrez explorer d'autres types d'authentifications [sur cette page](https://python-social-auth-docs.readthedocs.io/en/latest/backends/index.html). Chaque type d'authentification (Google, GitHub, Twitter...) possède ses propres étapes d'implémentation.

Commencez par écrire ces lignes, à la fin de votre `settings.py` :

```python

...

# google authentication
# https://python-social-auth-docs.readthedocs.io/en/latest/backends/google.html

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = ''
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = ''
```

Nous allons devoir [renseigner la clé et le mot de passe de notre certificat Oauth2](https://developers.google.com/identity/protocols/OAuth2?csw=1). Et pour ça, il va nous falloir créer ce certificat, en ouvrant [l'API de Google](https://developers.google.com/identity/protocols/OAuth2?csw=1) (un compte Google est necessaire) :

![Tableau de bord de Google API.](google_api.jpg)

En allant dans l'onglet `identifiants` à gauche, nous arrivons sur une page qui gère les identifiants Oauth2. Cliquez ensuite sur le bouton bleu "_créer des identifiants_", puis sur "_ID Client OAuth_" :

![onglet identifiants de Google API.](google_id.jpg)

Suivez ensuite les instructions en renseignant le type d'application : `web`, le nom : `django-oauth`, et les origines et redirections autorisées : `http://127.0.0.1:8000` pour les origines et `http://127.0.0.1:8000/complete/google-oauth2/` pour les redirections.

> Notez que ces urls ne fonctionneront que pour les tests en local. Il faudra rajouter les urls de production pour faire fonctionner l'authentification de Google en production.

Une fois créée, une fenêtre modale s'affiche avec l'identifiant et le mot de passe. Renseignez les dans les champs vides de notre `settings.py` :

```python
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = 'mon_id'  # renseignez votre ID
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'mon_mot_de_passe'  # renseignez votre mot de passe
```

> Si vous devez herberger votre projet en ligne, il sera plus sûre de [séparer les informations sensibles](https://help.pythonanywhere.com/pages/environment-variables-for-web-apps/) (identifiants, mots de passe) des fichiers suivis par git.

Ajoutons ensuite l'authentification backend de Google :

```python
# settings.py

...

AUTHENTICATION_BACKENDS = (
 'social_core.backends.google.GoogleOAuth2', # l'authentification de Google, qui intervient avant dans la pipeline
 'django.contrib.auth.backends.ModelBackend', # l'authentification de base de Django
)
```

Ah, n'oubliez pas non plus de redéfinir la redirection après l'authentification, depuis la variable `LOGIN_REDIRECT_URL` :

```python
# settings.py

...

LOGIN_REDIRECT_URL = "/"  # nous redirigeons vers la page de base, puisque nous n'avons que celle ci. ¯\_(ツ)_/¯
```

Enfin, modifions notre bouton pour qu'il nous redirige vers l'authentification de Google :

```html
<!-- ./base/templates/base.html -->
...

<button class="loginBtn loginBtn--google">
  <a href="{% url 'social:begin' 'google-oauth2' %}">Login with Google</a>
</button>

...
```

Ca y est, vous pouvez _enfin_ tester ce fameux bouton de login Google. :)
Si vous avez bien suivi les étapes, une page de sélection des comptes Google s'affichera, et vous serez ensuite redirigé vers la page de base du site, avec cette fois-ci une phrase de bienvenue et votre pseudo d'utilisateur.

Tout n'est pas terminé pour autant. Il vous faut encore créer un bouton pour vous déconnecter, et vous devrez aussi faire attention à la duplication des adresses email, si vous souhaitez mettre en place une authentification manuelle par email.

Mais pour ces deux points, je vous laisse le soin de vous renseigner. Un prochain tuto viendra sur l'utilisation de la [_pipeline_](https://bioinfo-fr.net/introduction-aux-pipelines) de `python-social-auth`, et nous verrons que nous pouvons vraiment nous approprier cette technologie !
