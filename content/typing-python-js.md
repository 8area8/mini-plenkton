---
title: Le typage dans Python et Javascript
intro: "Le typage en programmation donne beaucoup d'indices sur la philosophie et l'utilisation d'un langage: présentation !"

img:
  name: "maxime-gilbert-X-4NYxVZ4R0-unsplash.jpg"
  alt: "Statue tenant les technologies dans chaque main."

tags: [Python, Javascript]

badge:
  name: "CloudVisual"
  link: "https://unsplash.com/@cloudvisual?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"

added: 08/26/2019
categories: [programmation]
---

## Définition du typage

Le typage en programmation donne beaucoup d'indices sur la philosophie et l'utilisation d'un langage : présentation !

Selon [wikipédia](<https://fr.wikipedia.org/wiki/Type_(informatique)>) (Dieu de l'information facile), "_un type de donnée, ou simplement un "type", définit la nature des valeurs que peut prendre une donnée, ainsi que les opérateurs qui peuvent lui être appliqués_".

En programmation, on utilise des variables possédant un type particulier (booléen, entier, réel ou encore chaîne de caractères...) et le typage d'un langage définit _la manière_ dont ces données vont être appelées.

> En gros, c'est une manière d'annoncer au logiciel ce que nous avons comme type dans notre variable, et notre manière de le lui annoncer changera selon le langage que nous utilisons.

On peut scinder le typage en deux catégories :

- La première concerne son _dynamisme_
- La deuxième concerne sa _sûreté_

### Typage : statique, inféré ou dynamique ?

#### Le typage statique

Un langage à typage statique comporte une vérification des types à la compilation. Aussi, le type d'une variable _ne peut pas_ changer en cours d'éxecution du programme. Souvent, ces langages utilisent un typage _explicite_ (c'est-à-dire qu'on scpécifie le type de la variable qu'on déclare).

Exemple avec le langage C (typage statique et explicite) :

```c
int foo;
```

Ici, on définit une variable `foo` qui possède le type _int_ (entier).
On ne pourra pas changer son type. On ne pourra pas non plus assigner une _mauvaise_ valeur à cette variable (une chaîne de caractères par exemple).

#### Le typage inféré

Le typage inféré permet de ne pas avoir à indiquer le type d'une variable. Le compilateur se charge de détecter automatiquement les types.

Exemple avec le langage C# :

```c#
var foo = 1;
```

Nous avons déclaré une variable de type _integer_ (entier), sans avoir eu besoin de spécifier son type.

#### Le typage dynamique

Le typage est dit dynamique quand la vérification du type se fait au moment de l'éxecution du programme. Aussi, les variables dynamiques peuvent changer de type au cours du programme.

> Les langages à typage dynamique sont par extension à typage inféré.

Exemple avec Python :

```python
foo = 1
```

Ce qui est intéressant avec le typage dynamique, c'est qu'on peut redéfinir la même variable avec un autre type :

```python
foo = 1
foo = "coucou"
```

En python ce code est valide, dans les langages à typage statique ou inféré, ce code produira une erreur.

### Typage faible Vs typage fort

#### Le typage fort

Un typage fort définit un typage qui n'autorise pas les convertions de type implicites.

Exemple avec Python :

```python
bar = 1 + "2"  # cette ligne produira une erreur.
```

En Python, nous devons explicitement convertir les types avant d'effectuer des opérations entre eux :

```python
bar = 1 + int("2")  # cette ligne est valide.
```

#### Le typage faible

Un typage faible permet les convertions de type implicites.

Exemple avec Javascript :

```javascript
let foo = 1 + "2"; // le résultat est "12" !
```

## Javascript vs Python : la guerre du typage

En tant que développeur web Python, j'utilise souvent ces deux langages. Les deux sont [interpétés](https://www.actuia.com/faq/quelle-est-la-difference-entre-langage-interprete-semi-interprete-et-compile/) et donc dynamiques. Par contre, Python possède un **typage fort** alors que Javascript possède un **typage faible**.

### Javascript, ce langage démoniaque

Ce qui fait souvent polémique sur Javascript, c'est que sa combinaison de typage faible + dynamique peut rendre la résolution de bugs difficile !

Il en résulte d'ailleurs des résultats étranges, [passés un peu en revu dans ce très bon site](https://javascript.info/comparison), ou encore dans cet [article sur Github](https://github.com/denysdovhan/wtfjs), qui répertorie toutes les bizarreries du langage.

Enfin, voici une image fun qui symbolise ces problèmes de langage assez parlante :

![Erreurs de logique - religion et javascript.](trinity.jpg)

Une autre chose que je trouve agaçante dans ce langage, dans la continuité de cette logique à vouloir _tout faire passer_ : le retour `undefined` quand l'élément du DOM ciblé n'existe pas, alors qu'une erreur serait bien plus sécurisante.

> On peut quand même noter l'implémentation de l'égalité strict qui permet d'éviter les conversions implicites entre les éléments à comparer :

```javascript
"1" == true; // retourne true
"1" === true; // retourne false
```

### Python, lui, il a tout compris !

Python est vraiment bien conçu. Tout est pensé pour rendre son utilisation la plus logique et intuitive possible.

En python, pas de convertions implicites. Si on veut faire des opération ou des comparaisons entre différents types, il va falloir faire soi-même ces conversions.

Malgré tout, le langage permet d'effectuer des comparaisons logiques comme :

```python
my_list = []

if my_list:  # my_list étant vide, la comparaison vaut False
    return True
```

Mais là encore, aucune magie ~~noir~~ ! Le langage utilise la méthode spéciale `__bool__` pour retourner un équivalent booléen de l'objet dans cette comparaison.

Pour s'en assurer, nous vérifions qu'une liste vide n'est pas egal à `False` :

```python
[] == False  # retourne False.
```

En bref, avec Python vous aurez bien souvent plus d'erreurs qu'avec Javascript, mais elles seront toujours justifiées (et vous feront gagner un temps fou). Résultat ? Une vraie sensation de contrôle sur son code.

### Typescript, une alternative intéressante à Javascript

Typescript tend à résoudre les problèmes de typage faible de Javascript. Il évite beaucoup de conversions de type implicites et aide à la reconnaissance des types, grâce à un transpilateur qui va faire des vérifications avant de rendre un équivalent en Javascript.

Ainsi, le code suivant va générer une erreur :

```typescript
const foo = 1;
const bar = foo + "truc"; // génère une erreur :)
```

Mais ça n'évite pas tout :

```typescript
const bar = 1 + "truc"; // ne génère pas d'erreur :(
```

Nous arrivons à la fin de ce tuto sur le typage !

Pour une lecture plus générale, je vous conseille ce [tuto de Moussa Ndour](https://medium.com/@touskar/les-syst%C3%A8mes-de-typage-des-variables-e095648e4c87). ;)
