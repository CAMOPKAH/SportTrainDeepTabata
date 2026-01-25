// ================= ЗАГРУЗКА ПРОГРАММ ИЗ КАТАЛОГА =================

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/CAMOPKAH/SportTrainDeepTabata/main';

// Загруженные стили и скрипты для возможности их удаления
let loadedStyles = [];
let loadedScripts = [];

async function loadCatalog() {
    try {
        const response = await fetch(catalogUrl);
        if (!response.ok) throw new Error('Ошибка загрузки каталога');
        const data = await response.json();
        
        // Проверяем версию каталога и обрабатываем соответственно
        return processCatalogData(data);
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
        const statusElement = document.getElementById('status');
        statusElement.textContent = 'Ошибка загрузки программ. Используйте встроенную.';
        return null;
    }
}

// Обработка данных каталога с поддержкой разных версий
function processCatalogData(data) {
    // Определяем версию каталога
    const version = data.version || '1.0';
    
    if (version === '1.0') {
        // Старый формат - плоский список программ
        return {
            version: '1.0',
            folders: [],
            programs: data.programs || [],
            flatPrograms: data.programs || [] // Для обратной совместимости
        };
    } else if (version === '2.0') {
        // Новый формат - древовидная структура
        // Собираем все программы из древовидной структуры для поиска и обратной совместимости
        const allPrograms = collectAllPrograms(data.folders || []);
        
        return {
            version: '2.0',
            folders: data.folders || [],
            programs: allPrograms, // Плоский список для обратной совместимости
            flatPrograms: allPrograms,
            metadata: data.metadata || {}
        };
    }
    
    // По умолчанию обрабатываем как версию 1.0
    return {
        version: '1.0',
        folders: [],
        programs: data.programs || [],
        flatPrograms: data.programs || []
    };
}

// Рекурсивный сбор всех программ из древовидной структуры
function collectAllPrograms(folders) {
    let programs = [];
    
    for (const folder of folders) {
        // Добавляем программы текущей папки
        if (folder.programs && Array.isArray(folder.programs)) {
            programs = programs.concat(folder.programs.map(p => ({
                ...p,
                folderId: folder.id,
                folderName: folder.name,
                folderIcon: folder.icon
            })));
        }
        
        // Рекурсивно обрабатываем вложенные папки
        if (folder.folders && Array.isArray(folder.folders)) {
            programs = programs.concat(collectAllPrograms(folder.folders));
        }
    }
    
    return programs;
}

// Получение пути к папке для программы
function getFolderPath(folders, programId) {
    for (const folder of folders) {
        // Проверяем программы текущей папки
        if (folder.programs && folder.programs.some(p => p.id === programId)) {
            return [{ id: folder.id, name: folder.name, icon: folder.icon }];
        }
        
        // Рекурсивно проверяем вложенные папки
        if (folder.folders) {
            const subPath = getFolderPath(folder.folders, programId);
            if (subPath.length > 0) {
                return [{ id: folder.id, name: folder.name, icon: folder.icon }, ...subPath];
            }
        }
    }
    
    return [];
}

// Загрузка CSS файла
async function loadCSS(cssUrl) {
    return new Promise((resolve, reject) => {
        // Проверяем, не загружен ли уже этот файл
        const existingLink = document.querySelector(`link[data-dynamic-css="${cssUrl}"]`);
        if (existingLink) {
            resolve(existingLink);
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl.startsWith('http') ? cssUrl : `${GITHUB_BASE_URL}/${cssUrl}`;
        link.setAttribute('data-dynamic-css', cssUrl);
        
        link.onload = () => {
            loadedStyles.push(link);
            resolve(link);
        };
        link.onerror = () => reject(new Error(`Не удалось загрузить CSS: ${cssUrl}`));
        
        document.head.appendChild(link);
    });
}

// Загрузка JS файла
async function loadJS(jsUrl) {
    return new Promise((resolve, reject) => {
        // Проверяем, не загружен ли уже этот файл
        const existingScript = document.querySelector(`script[data-dynamic-js="${jsUrl}"]`);
        if (existingScript) {
            resolve(existingScript);
            return;
        }

        const script = document.createElement('script');
        script.src = jsUrl.startsWith('http') ? jsUrl : `${GITHUB_BASE_URL}/${jsUrl}`;
        script.setAttribute('data-dynamic-js', jsUrl);
        
        script.onload = () => {
            loadedScripts.push(script);
            resolve(script);
        };
        script.onerror = () => reject(new Error(`Не удалось загрузить JS: ${jsUrl}`));
        
        document.body.appendChild(script);
    });
}

// Удаление загруженных динамических стилей и скриптов
function removeDynamicAssets() {
    loadedStyles.forEach(link => {
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
    });
    loadedScripts.forEach(script => {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    });
    loadedStyles = [];
    loadedScripts = [];
}

async function loadProgram(programData) {
    if (!programData || !programData.url) return;
    
    try {
        // Удаляем предыдущие динамические ресурсы
        removeDynamicAssets();
        
        // Загружаем CSS файлы, если указаны
        if (programData.css && Array.isArray(programData.css)) {
            for (const cssFile of programData.css) {
                try {
                    await loadCSS(cssFile);
                } catch (error) {
                    console.warn(`Не удалось загрузить CSS файл ${cssFile}:`, error);
                }
            }
        } else if (programData.css && typeof programData.css === 'string') {
            try {
                await loadCSS(programData.css);
            } catch (error) {
                console.warn(`Не удалось загрузить CSS файл ${programData.css}:`, error);
            }
        }
        
        // Загружаем JS файлы, если указаны
        if (programData.js && Array.isArray(programData.js)) {
            for (const jsFile of programData.js) {
                try {
                    await loadJS(jsFile);
                } catch (error) {
                    console.warn(`Не удалось загрузить JS файл ${jsFile}:`, error);
                }
            }
        } else if (programData.js && typeof programData.js === 'string') {
            try {
                await loadJS(programData.js);
            } catch (error) {
                console.warn(`Не удалось загрузить JS файл ${programData.js}:`, error);
            }
        }
        
        // Загружаем данные программы
        const programUrl = programData.url.startsWith('http') 
            ? programData.url 
            : `${GITHUB_BASE_URL}/${programData.url}`;
            
        const response = await fetch(programUrl);
        if (!response.ok) throw new Error('Ошибка загрузки программы');
        const data = await response.json();
        
        // Обновляем данные
        exercises = data.exercises;
        workoutConfig = data.config || workoutConfig;
        
        // Отображаем информацию о программе с новыми полями
        updateProgramInfo(programData, data);
        
        // Сбрасываем и обновляем
        await resetWorkout();
        updateExerciseList();
        
        const statusElement = document.getElementById('status');
        statusElement.textContent = 'Программа загружена!';
        speak("Программа загружена: " + (data.name || programData.name));
    } catch (error) {
        console.error('Ошибка загрузки программы:', error);
        const statusElement = document.getElementById('status');
        statusElement.textContent = 'Ошибка загрузки. Используйте встроенную программу.';
    }
}

// Обновление информации о программе с новыми полями
function updateProgramInfo(programData, fileData) {
    const name = fileData.name || programData.name;
    const description = fileData.description || programData.description || 'Таймер тренировки с голосовыми оповещениями';
    
    // Обновляем заголовок
    document.querySelector('h1').textContent = `🔥 ${name}`;
    document.querySelector('.subtitle').textContent = description;
    
    // Создаем или обновляем блок с дополнительной информацией
    let infoContainer = document.getElementById('programInfoContainer');
    if (!infoContainer) {
        infoContainer = document.createElement('div');
        infoContainer.id = 'programInfoContainer';
        infoContainer.className = 'program-info-container';
        document.querySelector('.container').insertBefore(infoContainer, document.querySelector('.timer-container'));
    }
    
    // Собираем информацию из новых полей
    const infoFields = [];
    
    // Уровень сложности
    if (programData.level || programData.difficulty) {
        const level = programData.level || programData.difficulty;
        const levelText = getLevelText(level);
        infoFields.push(`<div class="info-item"><i class="fas fa-chart-line"></i> ${levelText}</div>`);
    }
    
    // Длительность
    if (programData.duration || programData.durationDisplay) {
        const duration = programData.durationDisplay || `${programData.duration} минут`;
        infoFields.push(`<div class="info-item"><i class="fas fa-clock"></i> ${duration}</div>`);
    }
    
    // Инвентарь
    if (programData.equipment) {
        infoFields.push(`<div class="info-item"><i class="fas fa-dumbbell"></i> ${programData.equipment}</div>`);
    }
    
    // Количество упражнений
    if (programData.exercisesCount) {
        infoFields.push(`<div class="info-item"><i class="fas fa-list-ol"></i> ${programData.exercisesCount} упражнений</div>`);
    }
    
    // Калории
    if (programData.calories) {
        infoFields.push(`<div class="info-item"><i class="fas fa-fire"></i> ~${programData.calories} ккал</div>`);
    }
    
    // Целевые области
    if (programData.focusAreas && Array.isArray(programData.focusAreas)) {
        infoFields.push(`<div class="info-item"><i class="fas fa-crosshairs"></i> ${programData.focusAreas.join(', ')}</div>`);
    }
    
    // Обновляем содержимое контейнера
    if (infoFields.length > 0) {
        infoContainer.innerHTML = `
            <div class="program-info-grid">
                ${infoFields.join('')}
            </div>
        `;
        infoContainer.style.display = 'block';
    } else {
        infoContainer.style.display = 'none';
    }
}

// Получение текста уровня сложности
function getLevelText(level) {
    const levelMap = {
        'beginner': 'Начинающий',
        'easy': 'Легкий',
        'intermediate': 'Средний',
        'medium': 'Средний',
        'advanced': 'Продвинутый',
        'hard': 'Сложный',
        'expert': 'Эксперт'
    };
    return levelMap[level.toLowerCase()] || level;
}
