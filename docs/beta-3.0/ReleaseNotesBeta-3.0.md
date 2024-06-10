# Release Notes - eCSB Beta 3.0 (Praca inżynierska)

## Mechaniki zaimplementowane w projekcie

### Mechanika klas

Każdy gracz podczas pierwszego wejścia do gry powinien otrzymać klasę. Klasy w grze być tak losowane, aby odchylenie standardowe ilości użytkowników wewnątrz klas  było maksymalnie równe 1.

### Mechanika produkcji

Gracz podczas rozgrywki może w obrębie swojej klasy produkować zasoby. Każdy zasób kosztuje pewną ilość pieniędzy oraz tokeny krzepy. Każda klasa powinna mieć osobne miejsce produkcji zaznaczone na mapie. Inni gracze powinni być powiadomieni o produkcji użytkownika przez pewien czas.

1. Gracz podchodzi do miejsca produkcji odpowiadającego jego klasie.
2. Otwiera dialog wyboru, w którym widnieje informacja o koszcie oraz ilości produkowanych zasobów.
3. Wybiera ilość produkcji.
4. Potwierdza wykonanie produkcji.
5. Następuje kilkusekundowe zamrożenie aktywności gracza oraz pojawia się pasek postępu produkcji.
6. Przez pewien czas gracze znajdujący się w wystarczająco bliskiej odległości widzą, że produkcja przebiegła pozytywnie.

<img src="images/game_workshop.PNG" alt="Produkcja" height="250" />

### Mechanika handlu

Gracz podczas rozgrywki może wymieniać się zasobami z innymi graczami, wchodząc  z nimi w interakcję. Aby doszło do handlu między graczami strona inicjująca wymianę, musi wysłać prośbę o handel, która może zostać przyjęta, odrzucona lub zignorowana przez drugą  stronę. Gracz może oferować tylko te zasoby, które posiada oraz żądać tylko tych, które posiada drugi gracz. Każdy z graczy może w dowolnym momencie zrezygnować z handlu.

1. Gracz podchodzi do innego gracza i wchodzi z nim w interakcję, wysyłając zaproszenie do handlu.
2. Po przyjęciu zaproszenia przez drugiego gracza otwiera się dialog handlu, w którym widnieje informacja o oferowanych i oczekiwanych zasobach.
3. Gracze na zmianę zmieniają warunki wymiany, aż do osiągnięcia porozumienia.
4. Jeden z graczy potwierdza wymianę, jeżeli oferta drugiego gracza mu odpowiada.
5. Dochodzi do wymiany zasobów między graczami.
6. Przez pewien czas gracze znajdujący się w wystarczająco bliskiej odległości od graczy biorących udział w wymianie widzą, że dokonali transakcji.

<img src="images/trade_turn.PNG" alt="Handel" height="250" />

### Mechanika podróży

Podróże są wydzielone przez ich poziom ryzyka. Istnieją 3 takie poziomy:
- Niski — jego koszt jest najmniejszy, przynosi najmniejsze korzyści finansowe.
- Wysoki — jest on najdroższy w kwestii potrzebnych zasobów, ale pozwala uzyskać największy przychód.
- Średni — jest to poziom pomiędzy niskim i wysokim pod względem kosztów oraz nagrody.

Każdy poziom ryzyka posiada swoją bramę na mapie, gdzie gracz może odbyć podróż. Gracz od razu po odbyciu podróży dostaje losową nagrodę z predefiniowanego przedziału nagród. Inni gracze powinni być powiadomieni o podróży użytkownika przez pewien czas. Oprócz możliwości odbycia zwykłej podróży istnieje również opcja planowania podróży. Polega ona na zbieraniu zasobów wymaganych na dane miasto, co ułatwia kontrolę nad posiadanymi surowcami. Podczas zbierania zasobów na wybrane miasto gracz nie może podróżować do żadnego innego miasta.

#### Zwykła podróż

1. Gracz podchodzi do miejsca podróży o określonym poziomie ryzyka.
2. Otwiera dialog wyboru, w którym widnieje informacja o koszcie wyprawy oraz możliwych nagrodach.
3. Potwierdza wykonanie podróży.
4. Następuje kilkusekundowe zamrożenie aktywności gracza oraz pojawia się pasek postępu podróży.
5. Przez pewien czas gracze znajdujący się w wystarczająco bliskiej odległości widzą, że wyprawa przebiegła pozytywnie.

<img src="images/travel_ready.PNG" alt="Zwykła podróż" height="250" />

#### Planowana podróż

1. Gracz podchodzi do miejsca podróży o określonym poziomie ryzyka.
2. Otwiera dialog wyboru, w którym widnieje informacja o koszcie wyprawy oraz możliwych nagrodach.
3. Potwierdza planowanie podróży.
4. Gracz zbiera zasoby na podróż poprzez wykonywanie produkcji, handlu oraz wchodzenie w kooperację (więcej niżej).
5. Po zebraniu odpowiedniej liczby zasobów gracz udaje się z powrotem do bramy wybranego miasta i potwierdza wykonanie podróży.
6. Następuje kilkusekundowe zamrożenie aktywności gracza oraz pojawia się pasek postępu podróży.
7. Przez pewien czas gracze znajdujący się w wystarczająco bliskiej odległości widzą, że wyprawa przebiegła pozytywnie.

<img src="images/travel_single_planning_go.PNG" alt="Planowana podróż" height="250" />

### Mechanika trybu kooperacji

Tryb kooperacji jest rozwinięciem opcji planowania podróży. W początkowej fazie projektu planowana była implementacja go na kształt handlu —  ze swobodnym zapraszaniem w dowolnym stanie oraz negocjacjami zasobów poprzedzonymi głosowaniem na docelowe miasto wyprawy. Ze względu na problemy biznesowe oraz techniczne, które pojawiły się na dalszym etapie precyzowania tego mechanizmu, ostatecznie zrezygnowaliśmy z opcji głosowania na miasto oraz uzależniliśmy zapraszanie do współpracy od wcześniejszego zaplanowania podróży. Po wybraniu miasta na planowaną podróż gracz ma kilka możliwości wejścia w kooperację:

#### Ogłoszenie o zbieraniu zasobów na podróż do miasta X (Opcja A)

Wszyscy gracze widzą nasz status i mogą wysłać prośbę o dołączenie do planowania wyprawy.  W przypadku akceptacji ogłaszającego się, gracze przechodzą od razu do decydowania o kosztach i nagrodach z podróży (zaczyna osoba, która wysłała prośbę o dołączenie).

<img src="images/travel_planning_advertisement.PNG" alt="Ogłaszanie współpracy" height="250" />

#### Bezpośrednie zaproponowanie wspólnego zbierania drugiemu graczowi (Opcja B)

Druga osoba może zaakceptować lub odrzucić ofertę. Jeśli się zgodzi, gracze przechodzą do decydowania o mieście (zaczyna osoba zapraszająca).

<img src="images/travel_coop_invite_join.PNG" alt="Zapraszanie do współpracy" height="250" />

#### Negocjacje podziału zasobów

Po zaakceptowaniu prośby lub zaproszenia gracze przechodzą do negocjacji dotyczących zasobów i nagrody. Gracze naprzemiennie zaznaczają, czym zajmą się oni, a czym ma zająć się druga strona. Ustalają także, który z nich pojedzie na wyprawę, oraz jaki będzie procentowy podział nagród z wyprawy. Jeśli dojdą do konsensusu, przechodzą do zbierania zasobów.

<img src="images/negotiation_turn.PNG" alt="Negocjacje" height="350" />

#### Zakończenie współpracy

Gdy gracze zbiorą wystarczającą liczbę zasobów, gracz, który ma jechać na wyprawę, musi udać się do punktu wyprawy z miastem, do którego miał jechać. Stamtąd wyrusza on na wyprawę.

1. Gdy gracz wykonał podróż, dostaje on od razu nagrodę zgodnie z wcześniej ustalonym podziałem.
2. Drugi gracz automatycznie dostanie swoją część nagrody razem z powiadomieniem o sukcesywnym zakończeniu kooperacji.
3. Po zakończeniu podróży tryb kooperacji kończy się, a gracze mogą rozpocząć nowe planowanie podróży.