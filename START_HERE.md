# Лабораторная № 1. Git, GitHub Actions и Docker
## Подробная инструкция для Windows и VS Code — вариант 3

Вариант 3 выбран по вашим предыдущим заданиям. По этой методичке он называется «Конвертер валют». Если преподаватель назначил другой вариант именно для этой работы, этот проект нужно адаптировать.

В архиве уже написаны исходники, тесты и конфигурация. Не нужно перепечатывать их вручную. Однако для лабораторной недостаточно загрузить ZIP на GitHub: необходимо выполнить Git-операции и получить реальные запуски Actions в своем репозитории. Ниже весь порядок.

Курсы учебные, фиксированные: USD=1, EUR=0.92, RUB=90, GBP=0.79, CNY=7.2 относительно доллара. Методичка разрешает фиксированные курсы вместо API. История сохраняется в памяти одного экземпляра конвертера; при завершении процесса очищается. Хранение в файле для варианта 3 не требуется.

## 1. Установить программы

1. Скачайте Node.js 24 LTS: https://nodejs.org/en/download . Для обычного Windows-компьютера выберите Windows Installer (.msi) подходящей архитектуры. Установите с настройками по умолчанию, включая PATH.
2. Установите Git for Windows: https://git-scm.com/downloads/win . Оставьте доступ Git из командной строки.
3. Установите VS Code: https://code.visualstudio.com/ .
4. Полностью закройте VS Code и откройте заново после установки Node и Git. Старый терминал не узнает об измененном PATH.
5. Docker Desktop нужен только для локальной проверки контейнера. Даже без него контейнер соберется на GitHub Actions. Для полной локальной проверки установите Docker Desktop по https://docs.docker.com/desktop/setup/install/windows-install/ , выполните требования установщика к WSL 2 и запустите Docker Desktop. Дождитесь запуска движка Linux containers.

Откройте VS Code → Terminal → New Terminal. Для этой инструкции используйте **PowerShell**. Команды вводите по одной, Enter после каждой.

```powershell
node --version
npm.cmd --version
git --version
```

Должны появиться версии программ. Здесь используется `npm.cmd`, чтобы PowerShell не блокировал скрипт npm.ps1. Менять политику выполнения скриптов не требуется.

## 2. Распаковать и открыть проект

1. Скачайте ZIP из ответа и выберите «Извлечь все». Не работайте внутри открытого архива.
2. Удобное место: папка `Projects` внутри вашей пользовательской папки.
3. В VS Code нажмите File → Open Folder и выберите именно `variant-3-project`, внутри которой находится `package.json`.
4. Откройте новый терминал. Выполните:

```powershell
Get-Location
Get-ChildItem -Force
```

В списке должны быть `package.json`, `src`, `tests`, `.github`. Если терминал находится в `C:\WINDOWS\System32`, не продолжайте там: откройте нужную папку через File → Open Folder и создайте новый терминал. Команда `cd Desktop` не нужна.

Файлы с точкой в начале не удаляйте: `.github` содержит автоматизацию, `.gitignore` исключает временные файлы из Git. `.git` в архиве нет: вы создадите собственную историю.

## 3. Запустить готовое приложение

```powershell
npm.cmd ci
npm.cmd start
npm.cmd start -- 100 USD EUR
npm.cmd start -- 90 RUB EUR
```

`npm ci` устанавливает точные версии из `package-lock.json`. Появится папка `node_modules`. Ее не нужно загружать на GitHub.

Ожидаемые результаты:

- демонстрация: `100 USD = 9000 RUB` и `90 RUB = 0.92 EUR`;
- команда с `100 USD EUR`: `100 USD = 92 EUR`;
- затем таблица истории текущего запуска.

Дата в истории зависит от времени запуска. Командная программа завершается сама: это нормально. У нее нет веб-страницы и она не слушает порт 3000.

Попробуйте ошибочный ввод:

```powershell
npm.cmd start -- -100 USD EUR
npm.cmd start -- 100 USD XYZ
```

Будет понятная ошибка. Это ожидаемая валидация, а не поломка приложения.

## 4. Проверить тесты, стиль и сборку

```powershell
npm.cmd test
npm.cmd run test:currency
npm.cmd run lint
npm.cmd run test:coverage
npm.cmd run build
node dist/app.js 100 USD RUB
npm.cmd audit -- --audit-level=moderate
```

`test` — все тесты; `test:currency` — только tests/converter.test.js; `lint` — настоящий ESLint; `build` — копирование исходников в dist кроссплатформенным Node-скриптом. Для такого JS-проекта транспиляция не нужна.

В coverage/index.html находится HTML-отчет. Откройте его браузером. Coverage показывает долю выполненных строк/ветвей, а не процент правильности программы. Запуски CLI в дочерних процессах проверяются интеграционными тестами, но не обязательно учитываются в покрытии родительского Jest-процесса. Поэтому 100% по app.js не ожидается.

Если audit выявит уязвимость, изучите его вывод. Не применяйте `npm audit fix --force` автоматически: он может сменить основные версии пакетов. После обычного `npm audit fix` повторите тесты и сохраните изменения package-lock.json. В CI аудит намеренно является проверкой, способной остановить pipeline.

## 5. Создать собственный Git-репозиторий

Ниже действия выполняются в распакованной папке. Имя и email замените своими. Email удобно взять в GitHub → Settings → Emails; можно использовать предоставленный GitHub noreply-адрес.

```powershell
git init
git config user.name "Masha"
git config user.email "ВАШ_EMAIL"
git add .
git commit -m "Initial commit: currency converter and CI/CD"
git branch -M main
git status
```

Должно быть `nothing to commit, working tree clean`. Коммит — снимок состояния файлов. Git пока работает только на компьютере.

Начальный коммит содержит готовую базовую реализацию. Далее вы действительно расширите ее в отдельных ветках, чтобы показать работу с Git, а не просто создавать пустые ветки.

## 6. Feature-ветка курсов и первый stash

```powershell
git switch -c feature/currency-rates
```

Откройте `src/exchangeRates.js`. Замените строку с RATES на:

```javascript
const RATES = Object.freeze({ USD: 1, EUR: 0.92, RUB: 90, GBP: 0.79, CNY: 7.2, JPY: 150 });
```

Сохраните Ctrl+S. Это новая учебная валюта JPY. Затем:

```powershell
git diff
git stash push -m "WIP: adding new currency pair"
git status
git stash list
```

Изменение временно исчезнет из файла — Git сохранил его в stash. Сделайте скриншот списка. Верните изменение:

```powershell
git stash pop
npm.cmd start -- 1 USD JPY
npm.cmd test
git add src/exchangeRates.js
git commit -m "Add JPY educational exchange rate"
```

Ожидается 150 JPY. Stash не является коммитом обычной ветки; после успешного pop запись удаляется из списка.

## 7. Hotfix и rebase

Сначала изменим main, чтобы rebase действительно переносил коммит на новую базу.

```powershell
git switch main
git switch -c hotfix/readme-update
Add-Content -Path README.md -Value "`nEducational rates are fixed; they are not live quotes."
git add README.md
git commit -m "Clarify fixed educational rates"
git switch main
git merge --no-ff hotfix/readme-update -m "Merge README hotfix"
git switch feature/currency-rates
git rebase main
git log --oneline --graph --all
```

main изменил README, а feature — exchangeRates.js, поэтому конфликта здесь быть не должно. Rebase перепишет идентификатор коммита добавления JPY: он будет применен поверх обновленного main. Пока ветка не отправлена на GitHub, это удобно и безопасно для учебного сценария.

Теперь влить функцию с обязательным merge-коммитом:

```powershell
git switch main
git merge --no-ff feature/currency-rates -m "Merge currency rates feature"
```

`--no-ff` нужен, чтобы Git создал отдельный merge-коммит даже при возможности простого перемещения указателя ветки.

## 8. Feature-ветка истории и второй stash

```powershell
git switch -c feature/conversion-history
```

Откройте `src/currencyConverter.js`. Внутри класса, перед `clearHistory()`, добавьте новый метод:

```javascript
  // Последняя операция; объект-копия защищает исходную историю.
  getLastConversion() {
    const last = this.history.at(-1);
    return last ? { ...last } : null;
  }
```

Сохраните файл. Выполните второй stash:

```powershell
git stash push -m "WIP: adding last conversion lookup"
git stash list
git status
```

Сделайте второй скриншот. Затем восстановите:

```powershell
git stash pop
```

В конец `tests/unit/history.test.js`, после закрытия существующего describe, добавьте:

```javascript
test('returns the last conversion or null', () => {
  const converter = new CurrencyConverter();
  expect(converter.getLastConversion()).toBeNull();
  converter.convert(1, 'USD', 'EUR');
  converter.convert(2, 'USD', 'RUB');
  const last = converter.getLastConversion();
  expect(last.result).toBe(180);
  last.result = 0;
  expect(converter.getLastConversion().result).toBe(180);
});
```

```powershell
npm.cmd test
npm.cmd run lint
git add src/currencyConverter.js tests/unit/history.test.js
git commit -m "Add last conversion lookup with test"
```

## 9. Cherry-pick отдельного коммита

Создадим отдельную ветку от main и перенесем только ее документационный коммит в feature истории.

```powershell
git switch main
git switch -c feature/testing-improvements
Set-Content -Path docs/test-note.txt -Value "Run npm test before merging a feature."
git add docs/test-note.txt
git commit -m "Document test command"
$fixCommit = git rev-parse HEAD
git switch feature/conversion-history
git cherry-pick $fixCommit
git log -3 --oneline
```

`$fixCommit` — переменная PowerShell с SHA исходного коммита. Выполняйте блок в одном терминале. Если терминал закрыли, найдите SHA через `git log feature/testing-improvements --oneline` и подставьте его в `git cherry-pick SHA`.

Перенесен только коммит `Document test command`, а не вся ветка. В новой ветке он обычно получает другой SHA, поскольку у него другой родитель.

```powershell
git switch main
git merge --no-ff feature/conversion-history -m "Merge conversion history feature"
```

## 10. Создать и разрешить настоящий конфликт

Используем отдельный учебный файл, чтобы не повреждать приложение.

```powershell
Set-Content -Path docs/merge-demo.txt -Value "History mode: basic"
git add docs/merge-demo.txt
git commit -m "Add merge conflict exercise"
git switch -c feature/history-description
Set-Content -Path docs/merge-demo.txt -Value "History mode: detailed"
git add docs/merge-demo.txt
git commit -m "Describe detailed history"
git switch main
Set-Content -Path docs/merge-demo.txt -Value "History mode: compact"
git add docs/merge-demo.txt
git commit -m "Describe compact history"
git merge --no-ff feature/history-description -m "Merge history description"
```

Последняя команда должна сообщить `CONFLICT (content)`. Это запланированный результат: две ветки изменили одну строку общего исходного файла по-разному.

1. Выполните `git status` и сделайте скриншот.
2. Откройте `docs/merge-demo.txt`. В нем будут маркеры `<<<<<<<`, `=======`, `>>>>>>>`.
3. Замените **все содержимое** файла одной строкой:

```text
History mode: compact output with detailed records
```

4. Сохраните Ctrl+S; маркеров в файле остаться не должно.
5. Завершите merge:

```powershell
git add docs/merge-demo.txt
git commit -m "Resolve history description merge conflict"
git status
git log --oneline --graph --all
npm.cmd test
```

Не выполняйте повторный merge вместо завершающего commit. Если случайно начали не тот merge, `git merge --abort` отменяет незавершенное слияние, но в этом упражнении нужно именно разрешить конфликт.

## 11. Посмотреть историю и ответить на вопросы

```powershell
git log --oneline --graph --all
git log --author="Masha" --since="1 hour ago"
git log --grep="conversion"
git rev-list --all --count
git branch --list
git log feature/testing-improvements --oneline
git log feature/conversion-history --oneline
```

Количество коммитов берите из **своего** `git rev-list --all --count`: оно зависит от дополнительных действий. Список веток берите из своего `git branch`. Cherry-picked коммит имеет сообщение `Document test command`; сравните исходный и перенесенный SHA. После отправки веток `--all` учитывает также remote-tracking refs, но одинаковые коммиты повторно не считает.

## 12. Создать репозиторий GitHub

1. Зайдите на https://github.com/ под своим аккаунтом.
2. Нажмите `+` → `New repository`.
3. Имя: `git-cicd-lab`.
4. Выберите Public, как в методичке.
5. Не добавляйте README, .gitignore и лицензию при создании: локальные файлы уже есть.
6. Нажмите Create repository.

Прежде чем отправлять код, откройте Settings → Environments и создайте `staging` и `production`. Для production включите Required reviewers, если это доступно, и назначьте проверяющего. Для одиночной учебной работы не включайте запрет собственного одобрения, если нет второго проверяющего. Если защита сред недоступна для вашего аккаунта, укажите это в отчете; не утверждайте, что настроили ее.

Workflow содержит только имитацию развертывания, как и пример методички. Образ действительно публикуется в GHCR; удаленный сервер для приложения не создается.

В терминале замените YOUR_USERNAME на свой логин:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/git-cicd-lab.git
git remote -v
git push -u origin main
git push origin feature/currency-rates feature/conversion-history feature/testing-improvements feature/history-description hotfix/readme-update
```

При первом push Git может открыть браузер для авторизации. Войдите самостоятельно. Обычный пароль аккаунта не вводите вместо токена в старом запросе Git; используйте штатную браузерную авторизацию Git Credential Manager.

`remote origin already exists` означает, что origin уже задан. Сначала проверьте `git remote -v`; только если URL неправильный, исправьте `git remote set-url origin https://github.com/YOUR_USERNAME/git-cicd-lab.git`.

## 13. Проверить GitHub Actions и образ

Откройте репозиторий → Actions. После push main появятся:

1. `CI - Variant 3`;
2. `Currency checks - Variant 3`.

В основном workflow последовательность такая:

- quality-checks: установка, ESLint, тесты и coverage, загрузка coverage-артефакта, аудит;
- build-and-test: матрица Node 22 и 24, тесты и сборка;
- docker-build: сборка тестовой стадии, запуск тестов в контейнере, production-сборка и проверка вывода;
- publish: вход в GHCR и публикация образа для amd64 и arm64;
- deploy-production: учебная имитация развертывания после одобрения среды, если оно настроено.

Для ветки develop выполняется deploy-staging. На PR и feature-ветках публикация выключена. Серые пропущенные задачи с условием `if` не являются ошибкой.

Откройте каждый job: смотрите время выполнения и вывод шагов. Скачайте `coverage-report` из Artifacts. На странице репозитория или в профиле → Packages найдите контейнер. Его имя: `ghcr.io/ваш_логин/git-cicd-lab`, теги main и main-<короткий SHA>. Для develop — тег develop.

Секрет GITHUB_TOKEN создается GitHub автоматически; вручную добавлять его не нужно. Только job publish получает `packages: write`, остальные имеют `contents: read`. Если публикация вернула permission denied, проверьте разрешения Actions и политики организации, а также связь существующего пакета с репозиторием. Смена видимости репозитория сама по себе не делает уже созданный пакет публичным.

## 14. Проверить develop и staging

Создавайте develop после того, как main успешно прошел проверки:

```powershell
git switch main
git switch -c develop
git push -u origin develop
```

Дождитесь нового workflow в Actions. Должны пройти проверки и публикация тега develop, затем deploy-staging. После проверки вернитесь:

```powershell
git switch main
```

## 15. Создать Pull Request

```powershell
git switch -c feature/pipeline-testing
Add-Content -Path README.md -Value "`nPipeline verification through a pull request."
git add README.md
git commit -m "Add pipeline testing documentation"
git push -u origin feature/pipeline-testing
```

На GitHub: Pull requests → New pull request → base `main`, compare `feature/pipeline-testing` → Create pull request. Название: `Проверка CI/CD конвертера валют`.

Не сливайте PR сразу. Сначала нужно показать ошибку и ее исправление. При открытом PR могут запускаться два набора workflow: на push и на pull_request. Это соответствует выбранным триггерам.

## 16. Намеренно сломать тест и исправить

В `tests/converter.test.js` найдите:

```javascript
expect(converter.convert(100, 'USD', 'RUB')).toBe(9000);
```

Поменяйте **только 9000 на 9001**, сохраните и выполните:

```powershell
npm.cmd test
git add tests/converter.test.js
git commit -m "Introduce test failure for pipeline testing"
git push
```

Локальный тест должен упасть. На GitHub Actions дождитесь красного запуска. В логе будет Expected: 9001, Received: 9000. Основной pipeline остановится на quality-checks; зависимые сборки будут skipped. Валютный workflow тоже станет красным. Сделайте скриншот ошибки.

Верните 9000, сохраните:

```powershell
npm.cmd test
git add tests/converter.test.js
git commit -m "Fix intentional currency test failure"
git push
```

Теперь дождитесь зеленых проверок **последнего коммита**, сделайте скриншот. Старый красный запуск останется в истории — это доказательство эксперимента.

После успешных проверок откройте PR → Merge pull request → Create a merge commit → Confirm merge. Затем синхронизируйте компьютер:

```powershell
git switch main
git pull --ff-only origin main
git log --oneline --graph --all
```

Если нужны обязательные проверки перед merge, настройте правило для main в Settings → Rules → Rulesets или Branches: require pull request и require status checks. Выбирайте фактические имена проверок из прошедшего PR. Для учебной демонстрации сохраните сведения о доступности этих настроек в своем аккаунте.

## 17. Локальная проверка Docker

Пропустите только если Docker Desktop недоступен: тогда предъявите проверку docker-build в Actions и честно укажите, что локально Docker не запускался.

Docker Desktop должен быть запущен. В корне проекта:

```powershell
docker version
docker build -f docker/Dockerfile --target test -t variant3:test .
docker run --rm variant3:test
docker build -f docker/Dockerfile --target production -t variant3:latest .
docker run --rm variant3:latest
docker run --rm variant3:latest node src/app.js 100 USD EUR
```

Точка в конце build — контекст сборки, то есть корневая папка проекта. Убирать ее нельзя. Путь `-f docker/Dockerfile` указывает расположение Dockerfile.

Рабочий .dockerignore находится в корне контекста. Копия в docker/.dockerignore включена для соответствия примерной структуре из методички, но при этих командах Docker использует корневой файл.

Контейнер production не содержит Jest/ESLint и запускается пользователем node. Тесты запускаются в test-стадии. Не запускайте `docker exec ... npm test` в production: там нет тестовых зависимостей, а консольная программа уже завершилась.

## 18. Что приложить к отчету

1. Цель и задачи из методички; ваш вариант 3.
2. Структуру файлов в VS Code.
3. Успешный запуск конвертера и таблицу истории.
4. Результаты тестов, lint и coverage (фактические значения).
5. Два снимка stash list в разные моменты работы.
6. Rebase, cherry-pick с SHA и граф истории.
7. Конфликт с маркерами и результат его разрешения.
8. Ссылку на ваш GitHub-репозиторий и Pull Request.
9. Зеленый pipeline, матрицу версий, Docker и пакет GHCR.
10. Красный запуск с намеренной ошибкой и последующий зеленый запуск.
11. Время каждого job, измеренное в Actions.
12. Ответы на контрольные вопросы из docs/variant-3-readme.md.

Таблица для фактических измерений:

| Задача | Первый запуск | Повторный запуск | Наблюдение |
|---|---|---|---|
| quality-checks | заполнить | заполнить | тесты, audit, npm cache |
| build-and-test 22 | заполнить | заполнить | матрица |
| build-and-test 24 | заполнить | заполнить | матрица |
| docker-build | заполнить | заполнить | локальная сборка runner |
| publish | заполнить | заполнить | Buildx, две архитектуры, GHA cache |

Не придумывайте длительность, SHA и скриншоты. Они появятся после действий в вашем аккаунте.

## 19. Частые проблемы

- `node/npm/git не является командой`: установите соответствующую программу и перезапустите VS Code. Проверьте `where.exe node` и `where.exe git`.
- `npm.ps1 cannot be loaded`: используйте `npm.cmd`, как в инструкции.
- `ENOENT package.json`: терминал открыт не в папке проекта.
- `npm ci` жалуется на несовпадение lock: если осознанно меняли package.json, выполните `npm.cmd install`, затем проверки и commit обоих package-файлов. Не удаляйте lock просто для обхода ошибки.
- `No tests found`: запускайте `npm.cmd run test:currency`. В методичке фильтр currency не совпадает с именем converter.test.js.
- Actions не запускается: проверьте путь `.github/workflows/ci.yml`, push и ветку; при необходимости включите Actions в настройках репозитория.
- `git status` показывает dist/coverage/node_modules: убедитесь, что .gitignore сохранен до первого git add.
- `docker cannot connect`: запустите Docker Desktop и дождитесь готовности движка.
- Audit упал: откройте отчет; это проверка зависимостей, а не ошибка арифметики конвертера.
- Publish пропущен на PR: так задумано. Публикация разрешена только push main/develop.
- Production ожидает approval: откройте workflow и одобрите deployment назначенным reviewer.
- При конфликте не понимаете, где продолжать: `git status` объяснит текущую операцию. Не делайте следующий раздел до завершения текущего.

## 20. Источники технических уточнений

- Исходное задание: приложенная методичка лабораторной № 1.
- https://nodejs.org/en/about/previous-releases — версии Node; используются 22/24 вместо старой матрицы 16/18/20.
- https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images — GHCR и публикация образов.
- https://docs.docker.com/build/concepts/context/ — контекст сборки и .dockerignore.

Примеры методички адаптированы к PowerShell: вместо Linux sed/cat/cp используется редактирование в VS Code и Node-скрипт сборки. Дублировать файлы базового и расширенного pipeline не нужно: ci.yml объединяет оба уровня, variant-3.yml отдельно проверяет индивидуальное задание.
