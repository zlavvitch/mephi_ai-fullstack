// Исходные данные — без изменений
const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

// Получение элементов DOM
const btn = document.querySelector("#show-program");
const program = document.querySelector("#program");
const form = document.querySelector("#service-form");

const guide = document.querySelector("#guide");
const audio = document.querySelector("#audio");
const catalog = document.querySelector("#catalog");

const errorData = document.querySelector("#data-error");
const errorChoice = document.querySelector("#choice-error");
const result = document.querySelector("#result");
const reportJson = document.querySelector("#report-json");

// Переменная доступна и за пределами try...catch
let data;

// Разбор JSON и управление видимостью формы
try {
  data = JSON.parse(sourceJson);
  form.hidden = false;
} catch (error) {
  errorData.textContent = "Ошибка данных.";
  errorData.hidden = false;
  form.hidden = true;
}

// Показ программы события
function showProgram() {
  program.innerHTML = data.event.meeting;
  program.hidden = false;
}

// Подключаем обработчик только при успешном разборе данных
if (data) {
  btn.addEventListener("click", showProgram);
}

// Реализация функции buildReport
function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selectedIds = [];

  if (guideChecked) {
    selectedIds.push("guide");
  }

  if (audioChecked) {
    selectedIds.push("audio");
  }

  if (catalogChecked) {
    selectedIds.push("catalog");
  }

  const selectedServices = services.filter((service) =>
    selectedIds.includes(service.id),
  );

  const report = selectedServices
    .map(({ title, price }) => {
      return { title: title.trim(), price };
    })
    .reduce(
      (acc, service) => {
        acc.total += service.price;
        acc.items.push(service);
        acc.count++;

        return acc;
      },
      { count: 0, total: 0, items: [] },
    );

  return report;
}

// Обработка отправки формы
function handleSubmit(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guide.checked,
    audio.checked,
    catalog.checked,
  );

  // Пустой выбор: показываем ошибку и скрываем прошлый результат
  if (report.count === 0) {
    errorChoice.textContent = "Выберите хотя бы одну услугу.";
    errorChoice.hidden = false;

    result.hidden = true;
    reportJson.hidden = true;

    return;
  }

  // Непустой выбор: скрываем ошибку
  errorChoice.hidden = true;

  // Объединяем названия услуг с переносами строк
  const titles = report.items.map((item) => item.title).join("<br>");

  result.innerHTML =
    `Выбрано услуг: ${report.count}<br>` +
    `Итого: ${report.total} руб.<br>` +
    titles;

  // Преобразуем отчёт в JSON-строку и проверяем обратный разбор
  const json = JSON.stringify(report);
  JSON.parse(json);

  reportJson.textContent = json;

  result.hidden = false;
  reportJson.hidden = false;
}

// Подключаем обработчики только при успешном разборе данных
if (data) {
  btn.addEventListener("click", showProgram);
  form.addEventListener("submit", handleSubmit);
}
