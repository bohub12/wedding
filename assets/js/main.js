(function () {
    'use strict';

    // ===== 설정 =====
    var CONFIG = {
        weddingDate: new Date('2027-01-10T14:30:00+09:00'),
        groomShort: '보규',
        brideShort: '민지',
        // images/gallery/01.jpg ~ NN.jpg (목록은 images/gallery/thumb/ 의 같은 파일명 썸네일)
        galleryCount: 25,
        // Kakao Developers JavaScript 키. 카카오톡 공유와 카카오내비 길안내에 쓴다.
        // 비워두면 공유는 기기 기본 공유나 링크 복사로, 길안내는 카카오맵 길찾기로 대체한다.
        kakaoJsKey: '',
        // 네이버 클라우드 플랫폼 Maps(Dynamic Map) Client ID. 비워두면 구글 지도가 나온다.
        naverMapKeyId: '',
        venue: {
            name: '더컨벤션 송파문정',
            lat: 37.48400527,
            lng: 127.12278912
        }
    };

    function $(sel, root) {
        return (root || document).querySelector(sel);
    }

    function $all(sel, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    }

    function pad(n) {
        return n < 10 ? '0' + n : String(n);
    }

    // ===== 토스트 =====
    var toastTimer;
    function toast(msg) {
        var el = $('#toast');
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            el.classList.remove('show');
        }, 1800);
    }

    function copyText(text, doneMsg) {
        function fallback() {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                toast(doneMsg);
            } catch (e) {
                toast('복사에 실패했습니다.');
            }
            document.body.removeChild(ta);
        }
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () {
                toast(doneMsg);
            }, fallback);
        } else {
            fallback();
        }
    }

    // ===== 달력 =====
    function renderCalendar() {
        var d = CONFIG.weddingDate;
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var first = new Date(year, month, 1).getDay();
        var last = new Date(year, month + 1, 0).getDate();
        var html = '';
        var cell = 0;

        html += '<tr>';
        for (var i = 0; i < first; i++, cell++) {
            html += '<td></td>';
        }
        for (var date = 1; date <= last; date++, cell++) {
            if (cell > 0 && cell % 7 === 0) {
                html += '</tr><tr>';
            }
            var cls = [];
            if (cell % 7 === 0) cls.push('sun');
            if (date === day) cls.push('eday');
            html += '<td class="' + cls.join(' ') + '"><span>' + date + '</span></td>';
        }
        while (cell % 7 !== 0) {
            html += '<td></td>';
            cell++;
        }
        html += '</tr>';
        $('#calendar-body').innerHTML = html;
    }

    // ===== 디데이 카운트다운 =====
    function updateCountdown() {
        var now = new Date();
        var diff = CONFIG.weddingDate - now;
        var abs = Math.abs(diff);
        var days = Math.floor(abs / 86400000);
        var hours = Math.floor(abs / 3600000) % 24;
        var mins = Math.floor(abs / 60000) % 60;
        var secs = Math.floor(abs / 1000) % 60;

        $('#cd-days').textContent = days;
        $('#cd-hours').textContent = pad(hours);
        $('#cd-mins').textContent = pad(mins);
        $('#cd-secs').textContent = pad(secs);

        // 날짜 기준 D-day 계산 (한국 시간 자정 기준)
        var kstToday = new Date(now.getTime() + 9 * 3600000);
        var kstWedding = new Date(CONFIG.weddingDate.getTime() + 9 * 3600000);
        var dayDiff = Math.round(
            (Date.UTC(kstWedding.getUTCFullYear(), kstWedding.getUTCMonth(), kstWedding.getUTCDate()) -
                Date.UTC(kstToday.getUTCFullYear(), kstToday.getUTCMonth(), kstToday.getUTCDate())) / 86400000
        );

        var names = CONFIG.groomShort + ' <span class="heart">♥</span> ' + CONFIG.brideShort + '의 결혼식';
        var text;
        if (dayDiff > 0) {
            text = names + '이 <span class="pink">' + dayDiff + '일</span> 남았습니다.';
        } else if (dayDiff === 0) {
            text = '오늘은 ' + names + ' 날입니다.';
        } else {
            text = names + '이 <span class="pink">' + (-dayDiff) + '일</span> 지났습니다.';
        }
        $('#dday-text').innerHTML = text;
    }

    // ===== 갤러리 =====
    var galleryImages = [];

    function renderGallery() {
        var grid = $('#gallery-grid');
        var html = '';
        for (var i = 1; i <= CONFIG.galleryCount; i++) {
            var src = 'images/gallery/' + pad(i) + '.jpg';
            var thumb = 'images/gallery/thumb/' + pad(i) + '.jpg';
            galleryImages.push(src);
            html += '<div class="item" data-index="' + (i - 1) + '" style="background-image:url(\'' + thumb + '\')"></div>';
        }
        grid.innerHTML = html;
        grid.addEventListener('click', function (e) {
            var item = e.target.closest('.item');
            if (item) openViewer(Number(item.getAttribute('data-index')));
        });
    }

    var viewerIndex = 0;

    function showViewerImage() {
        $('.viewer-img').src = galleryImages[viewerIndex];
        $('.viewer-count').textContent = (viewerIndex + 1) + ' / ' + galleryImages.length;
    }

    function openViewer(index) {
        viewerIndex = index;
        showViewerImage();
        $('#viewer').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeViewer() {
        $('#viewer').classList.remove('open');
        document.body.style.overflow = '';
    }

    function moveViewer(step) {
        viewerIndex = (viewerIndex + step + galleryImages.length) % galleryImages.length;
        showViewerImage();
    }

    function bindViewer() {
        var viewer = $('#viewer');
        $('.viewer-close').addEventListener('click', closeViewer);
        $('.viewer-prev').addEventListener('click', function () { moveViewer(-1); });
        $('.viewer-next').addEventListener('click', function () { moveViewer(1); });
        viewer.addEventListener('click', function (e) {
            if (e.target === viewer) closeViewer();
        });

        var startX = null;
        viewer.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
        }, { passive: true });
        viewer.addEventListener('touchend', function (e) {
            if (startX === null) return;
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) moveViewer(dx < 0 ? 1 : -1);
            startX = null;
        });
    }

    // ===== 모달 (연락하기) =====
    function bindModal() {
        $all('[data-open]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                $('#' + btn.getAttribute('data-open')).classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });
        $all('.modal [data-close]').forEach(function (el) {
            el.addEventListener('click', function () {
                el.closest('.modal').classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== 계좌 아코디언 / 복사 =====
    function bindAccounts() {
        $all('.c-account .item-title').forEach(function (btn) {
            btn.addEventListener('click', function () {
                btn.parentNode.classList.toggle('open');
            });
        });
        $all('[data-copy]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                copyText(btn.getAttribute('data-copy'), '계좌번호가 복사되었습니다.');
            });
        });
    }

    // ===== 공유 =====
    function pageUrl() {
        return location.href.split('#')[0].split('?')[0];
    }

    function loadKakao(cb) {
        if (window.Kakao) return cb();
        var s = document.createElement('script');
        s.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
        s.crossOrigin = 'anonymous';
        s.onload = cb;
        document.head.appendChild(s);
    }

    function bindShare() {
        var title = document.title;
        var desc = '2027년 1월 10일 일요일 오후 2시 30분\n더컨벤션 송파문정 그랜드볼룸홀';

        $('#share-button').addEventListener('click', function () {
            if (CONFIG.kakaoJsKey) {
                loadKakao(function () {
                    if (!window.Kakao.isInitialized()) window.Kakao.init(CONFIG.kakaoJsKey);
                    window.Kakao.Share.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: title,
                            description: desc,
                            imageUrl: new URL('images/og.jpg', pageUrl()).href,
                            link: { mobileWebUrl: pageUrl(), webUrl: pageUrl() }
                        },
                        buttons: [{
                            title: '모바일 청첩장 보기',
                            link: { mobileWebUrl: pageUrl(), webUrl: pageUrl() }
                        }]
                    });
                });
            } else if (navigator.share) {
                navigator.share({ title: title, text: desc, url: pageUrl() }).catch(function () {});
            } else {
                copyText(pageUrl(), '링크가 복사되었습니다.');
            }
        });

        $('#copy-link-button').addEventListener('click', function () {
            copyText(pageUrl(), '링크가 복사되었습니다.');
        });
    }

    // ===== 지도 =====
    function loadScript(src, cb) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = cb;
        s.onerror = cb;
        document.head.appendChild(s);
    }

    // 네이버 지도 키가 없거나 로드에 실패하면 구글 지도(키 불필요)를 좌표 기준으로 띄운다.
    function renderFallbackMap(el) {
        var v = CONFIG.venue;
        el.innerHTML = '<iframe title="' + v.name + ' 지도" src="https://maps.google.com/maps?q=' +
            v.lat + ',' + v.lng + '&z=17&hl=ko&output=embed"></iframe>';
    }

    function renderMap() {
        var el = $('#map');
        var v = CONFIG.venue;
        if (!CONFIG.naverMapKeyId) {
            renderFallbackMap(el);
            return;
        }
        loadScript('https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=' + CONFIG.naverMapKeyId, function () {
            if (!window.naver || !window.naver.maps) {
                renderFallbackMap(el);
                return;
            }
            var pos = new naver.maps.LatLng(v.lat, v.lng);
            var map = new naver.maps.Map(el, {
                center: pos,
                zoom: 17,
                scrollWheel: false,
                draggable: true,
                pinchZoom: true
            });
            new naver.maps.Marker({ position: pos, map: map });
        });
    }

    // ===== 길안내 (네이버 지도, 카카오내비, 티맵) =====
    var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // 앱 스킴을 열고, 앱이 없어 페이지가 그대로 남아 있으면 웹 주소로 보낸다.
    function openApp(appUrl, webUrl) {
        var timer = setTimeout(function () {
            if (document.visibilityState === 'visible' && webUrl) {
                location.href = webUrl;
            }
        }, 1500);
        document.addEventListener('visibilitychange', function onHide() {
            if (document.visibilityState === 'hidden') {
                clearTimeout(timer);
                document.removeEventListener('visibilitychange', onHide);
            }
        });
        location.href = appUrl;
    }

    function bindNavi() {
        var v = CONFIG.venue;
        var name = encodeURIComponent(v.name);
        var appname = encodeURIComponent(pageUrl());

        var actions = {
            naver: function () {
                var web = 'https://map.naver.com/p/search/' + name;
                if (isMobile) {
                    openApp('nmap://place?lat=' + v.lat + '&lng=' + v.lng + '&name=' + name + '&appname=' + appname, web);
                } else {
                    window.open(web, '_blank', 'noopener');
                }
            },
            kakao: function () {
                var web = 'https://map.kakao.com/link/to/' + name + ',' + v.lat + ',' + v.lng;
                if (CONFIG.kakaoJsKey && isMobile) {
                    loadKakao(function () {
                        if (!window.Kakao.isInitialized()) window.Kakao.init(CONFIG.kakaoJsKey);
                        window.Kakao.Navi.start({ name: v.name, x: v.lng, y: v.lat, coordType: 'wgs84' });
                    });
                } else {
                    window.open(web, '_blank', 'noopener');
                }
            },
            tmap: function () {
                if (!isMobile) {
                    toast('티맵은 모바일에서 이용할 수 있습니다.');
                    return;
                }
                openApp('tmap://route?goalname=' + name + '&goalx=' + v.lng + '&goaly=' + v.lat,
                    /iPhone|iPad|iPod/i.test(navigator.userAgent)
                        ? 'https://apps.apple.com/kr/app/id431589174'
                        : 'https://play.google.com/store/apps/details?id=com.skt.tmap.ku');
            }
        };

        $all('[data-navi]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                actions[btn.getAttribute('data-navi')]();
            });
        });
    }

    // ===== 스크롤 등장 효과 =====
    function bindFadeIn() {
        var items = $all('.fade-in');
        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('show'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        items.forEach(function (el) { io.observe(el); });
    }

    renderCalendar();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    renderGallery();
    bindViewer();
    bindModal();
    bindAccounts();
    bindShare();
    renderMap();
    bindNavi();
    bindFadeIn();
})();
