/**
 * 全站背景音乐播放器
 * 使用 localStorage 保存播放状态，实现跨页面连续播放
 */

(function() {
    // ========== 歌曲列表配置 ==========
    const playlist = [
        {
            title: '我本将心向月明',
            artist: '传统诗词 · 轻音乐',
            src: 'assets/music/我本将心向明月.mp3',
            fallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        },
        {
            title: 'SS那个石家庄人',
            artist: '小帅老师小曲',
            src: 'assets/music/SS那个石家庄人.mp3',
            fallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
        },
        {
            title: '《两 难》-海山来了',
            artist: '加木',
            src: 'assets/music/加木《两 难》-海山来了.mp3',
            fallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
        }
    ];

    // ========== 状态变量 ==========
    let currentIndex = 0;
    let isPlaying = false;
    let isMuted = false;
    let lastVolume = 0.6;
    let loadAttempted = false;
    let usingFallback = false;

    // ========== DOM 元素 ==========
    const audio = document.getElementById('bgMusic');
    const player = document.getElementById('player');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const muteBtn = document.getElementById('muteBtn');
    const songTitleDisplay = document.getElementById('songTitleDisplay');
    const songArtistDisplay = document.getElementById('songArtistDisplay');
    const playingIndicator = document.getElementById('playingIndicator');

    // ========== 工具函数 ==========
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // ========== 状态保存与恢复 ==========
    function saveState() {
        const state = {
            currentIndex: currentIndex,
            isPlaying: isPlaying,
            currentTime: audio.currentTime || 0,
            volume: audio.volume || 0.6,
            isMuted: isMuted
        };
        localStorage.setItem('musicPlayerState', JSON.stringify(state));
    }

    function loadState() {
        const saved = localStorage.getItem('musicPlayerState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                currentIndex = state.currentIndex || 0;
                isPlaying = state.isPlaying || false;
                lastVolume = state.volume || 0.6;
                isMuted = state.isMuted || false;
                return state.currentTime || 0;
            } catch (e) {
                return 0;
            }
        }
        return 0;
    }

    // ========== 清除错误状态样式 ==========
    function clearErrorState() {
        playPauseBtn.classList.remove('error-state', 'loading');
        songTitleDisplay.classList.remove('error-text');
        songArtistDisplay.classList.remove('error-hint');
        usingFallback = false;
    }

    // ========== 显示加载状态 ==========
    function showLoadingState() {
        playPauseBtn.classList.add('loading');
        playPauseBtn.textContent = '⏳';
        songArtistDisplay.textContent = '正在加载...';
    }

    // ========== 显示错误状态 ==========
    function showErrorState(message) {
        playPauseBtn.classList.remove('loading');
        playPauseBtn.classList.add('error-state');
        playPauseBtn.textContent = '⚠';
        songTitleDisplay.classList.add('error-text');
        songArtistDisplay.classList.add('error-hint');
        songArtistDisplay.textContent = message || '音频加载失败';
        playingIndicator.classList.remove('active');
        isPlaying = false;
        saveState();
    }

    // ========== 加载歌曲（带备用方案） ==========
    function loadSong(index, useFallback = false, resumeTime = 0) {
        const song = playlist[index];
        clearErrorState();
        showLoadingState();

        const audioSrc = useFallback ? song.fallback : song.src;

        console.log(`🎵 正在加载: ${song.title}`);
        console.log(`📁 路径: ${audioSrc}`);
        console.log(`🔄 是否使用备用源: ${useFallback ? '是' : '否'}`);

        audio.src = audioSrc;
        songTitleDisplay.textContent = useFallback ? `${song.title} (在线)` : song.title;
        songArtistDisplay.textContent = song.artist;
        audio.load();
        loadAttempted = false;
        usingFallback = useFallback;

        // 设置恢复播放位置
        if (resumeTime > 0) {
            audio.currentTime = resumeTime;
        }
    }

    // ========== 音频加载成功 ==========
    audio.addEventListener('loadeddata', () => {
        console.log('✅ 音频加载成功');
        clearErrorState();
        loadAttempted = true;
        playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
        songArtistDisplay.textContent = playlist[currentIndex].artist;

        // 恢复播放位置
        const savedTime = loadState();
        if (savedTime > 0 && audio.currentTime === 0) {
            audio.currentTime = savedTime;
        }

        // 如果之前在播放状态，自动恢复播放
        if (isPlaying) {
            audio.play().then(() => {
                playingIndicator.classList.add('active');
                playPauseBtn.textContent = '⏸';
            }).catch(e => {
                console.warn('自动恢复播放失败:', e.message);
                isPlaying = false;
                playPauseBtn.textContent = '▶';
                playingIndicator.classList.remove('active');
                saveState();
            });
        }
    });

    // ========== 音频加载失败 → 尝试备用源 ==========
    audio.addEventListener('error', (e) => {
        const song = playlist[currentIndex];
        console.error('❌ 音频加载失败:', audio.src);
        console.error('错误详情:', audio.error ? audio.error.message : '未知错误');

        if (!usingFallback && song.fallback && song.fallback !== song.src) {
            console.log('🔄 尝试使用在线备用音频...');
            showLoadingState();
            songArtistDisplay.textContent = '正在切换在线备用...';
            loadSong(currentIndex, true);
        } else if (usingFallback) {
            showErrorState('在线音频也无法加载');
            console.error('❌ 备用音频也加载失败');
        } else {
            showErrorState(`文件不存在`);
            console.error('💡 请将音乐文件放置到正确路径');
        }
    });

    // ========== 播放/暂停切换 ==========
    function togglePlay() {
        // 阻止事件冒泡，避免触发播放器展开/收起
        event.stopPropagation();
        
        if (audio.src === '' || audio.src === window.location.href) {
            console.log('🎵 首次加载音频...');
            const savedTime = loadState();
            loadSong(currentIndex, false, savedTime);
            const onLoaded = () => {
                audio.removeEventListener('loadeddata', onLoaded);
                if (savedTime > 0) {
                    audio.currentTime = savedTime;
                }
                audio.play().then(() => {
                    isPlaying = true;
                    playPauseBtn.textContent = '⏸';
                    playingIndicator.classList.add('active');
                    saveState();
                }).catch(err => {
                    console.warn('播放失败:', err.message);
                    showErrorState('播放被浏览器阻止，请再次点击');
                });
            };
            audio.addEventListener('loadeddata', onLoaded, { once: true });
            return;
        }

        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playPauseBtn.textContent = '▶';
            playingIndicator.classList.remove('active');
            saveState();
            console.log('⏸ 已暂停');
        } else {
            audio.play().then(() => {
                isPlaying = true;
                playPauseBtn.textContent = '⏸';
                playingIndicator.classList.add('active');
                clearErrorState();
                saveState();
                console.log('▶ 正在播放');
            }).catch(err => {
                console.warn('播放失败:', err.message);
                showErrorState('请点击播放按钮');
                isPlaying = false;
                playPauseBtn.textContent = '▶';
                playingIndicator.classList.remove('active');
                saveState();
            });
        }
    }

    playPauseBtn.addEventListener('click', togglePlay);

    // ========== 音频事件监听 ==========
    audio.addEventListener('play', () => {
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
        playingIndicator.classList.add('active');
        clearErrorState();
        saveState();
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        playingIndicator.classList.remove('active');
        saveState();
    });

    audio.addEventListener('ended', () => {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        playingIndicator.classList.remove('active');
        saveState();
        // 自动播放下一首
        console.log('🎵 当前曲目播放完毕，切换到下一首');
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
        const onLoaded = () => {
            audio.removeEventListener('loadeddata', onLoaded);
            audio.play().then(() => {
                isPlaying = true;
                saveState();
            }).catch(e => console.warn('自动播放下一首失败'));
        };
        audio.addEventListener('loadeddata', onLoaded, { once: true });
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration && isFinite(audio.duration)) {
            // 定期保存播放进度
            saveState();
        }
    });

    // ========== 上一首/下一首 ==========
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
        const onLoaded = () => {
            audio.removeEventListener('loadeddata', onLoaded);
            if (isPlaying) audio.play().then(() => saveState()).catch(e => console.warn('切换歌曲播放失败'));
        };
        audio.addEventListener('loadeddata', onLoaded, { once: true });
        isPlaying = true;
        saveState();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
        const onLoaded = () => {
            audio.removeEventListener('loadeddata', onLoaded);
            if (isPlaying) audio.play().then(() => saveState()).catch(e => console.warn('切换歌曲播放失败'));
        };
        audio.addEventListener('loadeddata', onLoaded, { once: true });
        isPlaying = true;
        saveState();
    });

    // ========== 音量控制 ==========
    const savedState = loadState();
    audio.volume = savedState.volume || 0.6;
    volumeSlider.value = audio.volume;
    if (savedState.isMuted) {
        audio.volume = 0;
        volumeSlider.value = 0;
        muteBtn.textContent = '🔇';
        isMuted = true;
    }

    volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const vol = parseFloat(e.target.value);
        audio.volume = vol;
        if (vol === 0) {
            muteBtn.textContent = '🔇';
            isMuted = true;
        } else {
            muteBtn.textContent = '🔊';
            isMuted = false;
            lastVolume = vol;
        }
        saveState();
    });

    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMuted) {
            audio.volume = lastVolume || 0.6;
            volumeSlider.value = audio.volume;
            muteBtn.textContent = '🔊';
            isMuted = false;
        } else {
            lastVolume = audio.volume;
            audio.volume = 0;
            volumeSlider.value = 0;
            muteBtn.textContent = '🔇';
            isMuted = true;
        }
        saveState();
    });

    // ========== 页面加载时恢复播放状态 ==========
    console.log('🎶 音乐播放器已就绪');
    console.log('📋 播放列表:');
    playlist.forEach((song, i) => {
        console.log(`   ${i + 1}. ${song.title} - ${song.artist}`);
    });

    // 恢复之前的播放状态
    const resumeTime = loadState();
    currentIndex = savedState.currentIndex || 0;
    isPlaying = savedState.isPlaying || false;

    // 延迟加载歌曲
    setTimeout(() => {
        if (!loadAttempted && (audio.src === '' || audio.src === window.location.href)) {
            loadSong(currentIndex, false, resumeTime);
        }
    }, 500);

    // ========== 双击折叠/展开播放器 ==========
    player.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        player.classList.toggle('collapsed');
        const isCollapsed = player.classList.contains('collapsed');
        localStorage.setItem('musicPlayerCollapsed', isCollapsed ? 'true' : 'false');
    });

    // 页面加载时恢复折叠状态
    if (localStorage.getItem('musicPlayerCollapsed') === 'true') {
        player.classList.add('collapsed');
    }

    // 页面卸载前保存状态
    window.addEventListener('beforeunload', () => {
        saveState();
    });

})();