// script.js

document.addEventListener('DOMContentLoaded', () => {

    // Tunggu sampai seluruh halaman dan gambar benar-benar selesai dimuat
    window.addEventListener('load', function() {
        AOS.init({
            once: true,       // Animasi hanya jalan 1x
            offset: 50,       // Titik pemicu animasi
            duration: 800,    // Kecepatan
            easing: 'ease-out-cubic'
        });
    });

    // === 1. LOGIKA MENU MOBILE & BFCache FIX (ULTIMATE) ===
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');

    if (mobileMenuBtn && mobileMenu && hamburgerIcon) {
        // Toggle Buka/Tutup Menu
        mobileMenuBtn.addEventListener('click', () => {
            // Bersihkan sisa inline style jika ada
            mobileMenu.style.transition = ''; 
            mobileMenu.style.visibility = '';
            
            mobileMenu.classList.toggle('opacity-0');
            mobileMenu.classList.toggle('-translate-y-10');
            mobileMenu.classList.toggle('pointer-events-none');
            
            if (mobileMenu.classList.contains('opacity-0')) {
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
            } else {
                hamburgerIcon.classList.remove('fa-bars');
                hamburgerIcon.classList.add('fa-xmark');
            }
        });

        // Menutup menu dengan paksa saat link diklik
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                // SUNTIKAN INSTAN: Memaksa menu lenyap seketika sebelum browser memotret layar
                mobileMenu.style.transition = 'none';
                mobileMenu.style.visibility = 'hidden'; 
                mobileMenu.style.opacity = '0';
                
                // Sinkronkan class Tailwind di belakang layar
                mobileMenu.classList.add('opacity-0', '-translate-y-10', 'pointer-events-none');
                
                // Kembalikan ikon
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
            });
        });

        // Pembersihan saat halaman dimuat kembali dari tombol "Back"
        window.addEventListener('pageshow', function (event) {
            if (event.persisted) {
                // Pastikan status tertutup
                mobileMenu.classList.add('opacity-0', '-translate-y-10', 'pointer-events-none');
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
                
                // Cabut suntikan instan setelah layar aman (agar menu bisa dibuka lagi)
                requestAnimationFrame(() => {
                    mobileMenu.style.transition = '';
                    mobileMenu.style.visibility = '';
                    mobileMenu.style.opacity = '';
                });
            }
        });
    }

    // 5. Logic Tombol WhatsApp Nempel Kanan (Muncul saat di-scroll)
    const waBtn = document.getElementById('floating-wa');
    if (waBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) { // Muncul setelah scroll 200px
                waBtn.classList.remove('opacity-0', 'translate-x-full', 'pointer-events-none');
                waBtn.classList.add('opacity-100', 'translate-x-0');
            } else { // Sembunyikan ke kanan jika di paling atas
                waBtn.classList.add('opacity-0', 'translate-x-full', 'pointer-events-none');
                waBtn.classList.remove('opacity-100', 'translate-x-0');
            }
        });
    }
    
    // 6. LOGIKA POP-UP BANNER DINAMIS ===
    const popupBanner = document.getElementById('popup-banner');
    const popupContent = document.getElementById('popup-content');
    const closePopupBtn = document.getElementById('close-popup');
    const popupTrack = document.getElementById('popup-track');
    const popupCta = document.getElementById('popup-cta');
    const popupDots = document.getElementById('popup-dots');

    // Data Banner Pop-up (Bisa ditambah/dikurangi)
    const popupData = [
        { 
            // Ganti src dengan link poster promosi/event Anda
            src: "Assets/Flyer/baby-massage.jpg", 
            link: "https://wa.me/6281327189900?text=Halo%20Bu%20Bidan,%20saya%20ingin%20tahu%20lebih%20lanjut%20terkait%20*Baby%20Massage*"
        },
        { 
            src: "Assets/Flyer/baby-spa.jpg", 
            link: "https://wa.me/6281327189900?text=Halo%20Bu%20Bidan,%20saya%20ingin%20tahu%20lebih%20lanjut%20terkait%20*Baby%20SPA*"
        },
        { 
            src: "Assets/Flyer/newborn-photo.jpg", 
            link: "https://wa.me/6281327189900?text=Halo%20Bu%20Bidan,%20saya%20ingin%20tahu%20lebih%20lanjut%20terkait%20*Newborn%20Photo*"
        },
        {
            src: "Assets/Flyer/newborn-postpartum-care.jpg", 
            link: "https://wa.me/6281327189900?text=Halo%20Bu%20Bidan,%20saya%20ingin%20tahu%20lebih%20lanjut%20terkait%20*Newborn%20&%20Postpartum%20Care*"
        },
        {
            src: "Assets/Flyer/pelayanan-kb.jpg",
            link: "https://wa.me/6281327189900?text=Halo%20Bu%20Bidan,%20saya%20ingin%20tahu%20lebih%20lanjut%20terkait%20*Pelayanan%20KB*"
        },
        {
            src: "Assets/Flyer/sakinah-bumil-class.jpg",
            link: "https://wa.me/6281327189900?text=Halo%20Bu%20Bidan,%20saya%20ingin%20tahu%20lebih%20lanjut%20terkait%20*Sakinah%20Bumil%20Class*"
        },
        {
            src: "Assets/Flyer/vagina-toilet.jpg",
            link: "https://wa.me/6281327189900?text=Halo%20Bu%20Bidan,%20saya%20ingin%20tahu%20lebih%20lanjut%20terkait%20*Vagina%20Toilet*"
        }
    ];

    let currentPopupSlide = 0;
    let popupInterval;

    if (popupBanner) {
        // Render Gambar dan Titik Indikator
        popupData.forEach((item, index) => {
            const a = document.createElement('a');
            a.href = item.link;
            a.target = "_blank";
            a.className = "w-full shrink-0 block cursor-pointer"; 
            
            const img = document.createElement('img');
            img.src = item.src;
            img.className = "w-full h-auto aspect-[1131/1600] object-cover"; 
            
            a.appendChild(img);
            popupTrack.appendChild(a);

            const dot = document.createElement('div');
            dot.className = `w-2 h-2 rounded-full transition-colors duration-300 ${index === 0 ? 'bg-primary' : 'bg-gray-300'}`;
            popupDots.appendChild(dot);
        });

        function updatePopupSlide() {
            popupTrack.style.transform = `translateX(-${currentPopupSlide * 100}%)`;
            popupCta.href = popupData[currentPopupSlide].link;
            Array.from(popupDots.children).forEach((dot, index) => {
                dot.className = `w-2 h-2 rounded-full transition-colors duration-300 ${index === currentPopupSlide ? 'bg-primary' : 'bg-gray-300'}`;
            });
        }

        function nextPopupSlide() {
            currentPopupSlide = (currentPopupSlide + 1) % popupData.length;
            updatePopupSlide();
        }

        function closePopup() {
            popupBanner.classList.add('opacity-0', 'pointer-events-none');
            popupContent.classList.add('scale-95');
            document.body.classList.remove('overflow-hidden');
            clearInterval(popupInterval);
        }

        // --- FUNGSI BARU: Pengecekan Reload / Kunjungan Awal ---
        // Mendeteksi apakah pengunjung me-refresh halaman (reload)
        const navEntry = performance.getEntriesByType("navigation")[0];
        const isReload = navEntry && navEntry.type === "reload";
        
        // Mendeteksi apakah ini adalah kunjungan pertama kali di tab ini
        const isFirstVisit = !sessionStorage.getItem("popupShown");

        // HANYA jalankan Pop-up jika Refresh ATAU Kunjungan Pertama
        if (isFirstVisit || isReload) {
            
            // Beri tanda bahwa popup sudah pernah dimunculkan di sesi ini
            sessionStorage.setItem("popupShown", "true");

            setTimeout(() => {
                popupBanner.classList.remove('opacity-0', 'pointer-events-none');
                popupContent.classList.remove('scale-95');
                document.body.classList.add('overflow-hidden'); 
                
                updatePopupSlide();
                popupInterval = setInterval(nextPopupSlide, 3000);
            }, 1500);
            
        }

        // Menutup Pop-up saat tombol (X) diklik
        closePopupBtn.addEventListener('click', closePopup);

        // Menutup pop-up jika area gelap di luar kotak pop-up diklik
        popupBanner.addEventListener('click', (e) => {
            if (e.target === popupBanner) {
                closePopup();
            }
        });
    }

});

// === 7. LOGIKA FORMULIR KE WHATSAPP ===
    const formKonsultasi = document.getElementById('form-konsultasi');

    if (formKonsultasi) {
        formKonsultasi.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah website me-refresh halaman

            // Mengambil nilai dari inputan pengguna
            const nama = document.getElementById('nama').value;
            const nohp = document.getElementById('nohp').value;
            const layanan = document.getElementById('layanan').value;
            const pesan = document.getElementById('pesan').value;

            // Nomor WhatsApp tujuan (Bidan Desy)
            const waNumber = "6281327189900";

            // Membuat format pesan yang rapi
            const textWA = `Halo Bu Bidan, saya ingin berkonsultasi.%0A%0A` +
                           `*Nama:* ${nama}%0A` +
                           `*No. HP/WA:* ${nohp}%0A` +
                           `*Layanan Dituju:* ${layanan}%0A` +
                           `*Pesan/Keluhan:* ${pesan}%0A%0A` +
                           `Terima kasih.`;

            // Membuat link WhatsApp dan membuka di tab baru/aplikasi WA
            const waLink = `https://wa.me/${waNumber}?text=${textWA}`;
            window.open(waLink, '_blank');
            
            // Mengosongkan form setelah dikirim (opsional)
            formKonsultasi.reset();
        });
    }

// === 8. LOGIKA CUSTOM DROPDOWN LAYANAN ===
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownText = document.getElementById('dropdown-text');
    const dropdownIcon = document.getElementById('dropdown-icon');
    const inputLayanan = document.getElementById('layanan');
    const dropdownContainer = document.getElementById('custom-dropdown-container');

    if (dropdownButton) {
        // Buka/Tutup menu saat kolom diklik
        dropdownButton.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('opacity-0');
            dropdownMenu.classList.toggle('pointer-events-none');
            dropdownMenu.classList.toggle('-translate-y-2');
            dropdownIcon.classList.toggle('rotate-180');
        });

        // Logika saat salah satu pilihan layanan diklik
        const dropdownItems = dropdownMenu.querySelectorAll('li');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const text = this.innerText;

                // Ubah teks abu-abu menjadi hitam (tanda sudah memilih)
                dropdownText.innerText = text;
                dropdownText.classList.remove('text-gray-400');
                dropdownText.classList.add('text-textDark');

                // Masukkan nilai ke input tersembunyi untuk dikirim ke WA
                inputLayanan.value = value;

                // Tutup menu otomatis
                dropdownMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                dropdownIcon.classList.remove('rotate-180');
            });
        });

        // Tutup menu otomatis jika pengunjung mengeklik area kosong di luar kotak
        document.addEventListener('click', function(e) {
            if (!dropdownContainer.contains(e.target)) {
                dropdownMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                dropdownIcon.classList.remove('rotate-180');
            }
        });
    }

// === 9. LOGIKA MODAL POP-UP EVENT ===
    const eventCards = document.querySelectorAll('.event-card');
    const eventModal = document.getElementById('event-modal');
    
    if (eventModal && eventCards.length > 0) {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        const closeModalBtn = document.getElementById('close-modal-btn');
        
        // Elemen yang akan diisi datanya
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalTime = document.getElementById('modal-time');
        const modalDesc = document.getElementById('modal-desc');
        const modalBtnWa = document.getElementById('modal-btn-wa');
        
        // Elemen area yang bisa di-scroll di dalam pop-up
        const scrollableArea = modalContent.querySelector('.overflow-y-auto');

        // Fungsi Buka Modal
        eventCards.forEach(card => {
            card.addEventListener('click', function() {
                // Ambil data dari atribut HTML kartu yang diklik
                const title = this.getAttribute('data-title');
                const date = this.getAttribute('data-date');
                const time = this.getAttribute('data-time');
                const desc = this.getAttribute('data-desc');
                const img = this.getAttribute('data-img');

                // Masukkan data ke dalam Modal
                modalTitle.innerText = title;
                modalDate.innerText = date;
                modalTime.innerText = time;
                modalDesc.innerText = desc;
                modalImg.src = img;

                // Buat link WA dinamis berdasarkan judul event
                const waNumber = "6281327189900";
                const waText = `Halo Bidan Desy, saya ingin mendaftar acara *${title}* yang diadakan pada ${date}. Mohon info persyaratannya. Terima kasih.`;
                modalBtnWa.href = `https://wa.me/${waNumber}?text=${waText}`;

                // RESET SCROLL: Kembalikan posisi scroll ke paling atas (0)
                if (scrollableArea) {
                    scrollableArea.scrollTop = 0;
                }

                // Tampilkan Modal dengan animasi
                eventModal.classList.remove('opacity-0', 'pointer-events-none');
                modalContent.classList.remove('scale-95');
                document.body.classList.add('overflow-hidden'); // Kunci scroll layar belakang
            });
        });

        // Fungsi Tutup Modal
        function closeEventModal() {
            eventModal.classList.add('opacity-0', 'pointer-events-none');
            modalContent.classList.add('scale-95');
            document.body.classList.remove('overflow-hidden');
        }

        // Tutup jika tombol X diklik atau luar kotak diklik
        closeModalBtn.addEventListener('click', closeEventModal);
        modalOverlay.addEventListener('click', closeEventModal);
    }

// === 10. LOGIKA AUTO-SLIDER TESTIMONI (INFINITE LOOP) ===
    const testimonialTrack = document.getElementById('testimonial-track');
    
    if (testimonialTrack) {
        // Ambil kartu asli
        const originalCards = Array.from(testimonialTrack.children);
        
        // 1. Gandakan kartu dan masukkan ke ujung agar tercipta ilusi tidak ada ujungnya (Infinite Loop)
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            testimonialTrack.appendChild(clone);
        });

        let currentIndex = 0;
        let isTransitioning = false;

        function slideNextTestimonial() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentIndex++;
            const cardWidth = originalCards[0].offsetWidth; // Ukuran 1 kartu
            
            // Animasi geser yang halus
            testimonialTrack.style.transition = 'transform 0.8s ease-in-out';
            testimonialTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

            // Jika posisi sudah mencapai akhir kartu asli, kembalikan ke awal dalam 0 detik secara rahasia
            if (currentIndex === originalCards.length) {
                setTimeout(() => {
                    testimonialTrack.style.transition = 'none';
                    currentIndex = 0;
                    testimonialTrack.style.transform = `translateX(0px)`;
                    isTransitioning = false;
                }, 800); // Harus sama dengan durasi transition (0.8s)
            } else {
                setTimeout(() => {
                    isTransitioning = false;
                }, 800);
            }
        }

        // Jalankan otomatis setiap 3.5 detik (Slide -> Tunggu -> Slide)
        let slideInterval = setInterval(slideNextTestimonial, 3500);

        // Hentikan slider saat di-hover/disentuh agar pengunjung bisa membaca
        testimonialTrack.addEventListener('mouseenter', () => clearInterval(slideInterval));
        testimonialTrack.addEventListener('mouseleave', () => slideInterval = setInterval(slideNextTestimonial, 3500));
        
        testimonialTrack.addEventListener('touchstart', () => clearInterval(slideInterval), {passive: true});
        testimonialTrack.addEventListener('touchend', () => slideInterval = setInterval(slideNextTestimonial, 3500));

        // Reset ukuran jika HP dimiringkan atau ukuran browser diubah
        window.addEventListener('resize', () => {
            testimonialTrack.style.transition = 'none';
            currentIndex = 0;
            testimonialTrack.style.transform = `translateX(0px)`;
        });
    }

// === 11. DATABASE & LOGIKA GALERI (CONTINUOUS MARQUEE) ===
    const galleryCarousel = document.getElementById('gallery-carousel');

    if (galleryCarousel) {
        
        // 1. Tulis Database Galeri Anda di Sini
        const galleryDatabase = [
            {
                img: "Assets/Fasilitas/ruang-pemeriksaan.jpg",
                title: "Ruang Pemeriksaan"
            },
            {
                img: "Assets/Fasilitas/ruang-pemeriksaan-1.jpg",
                title: "Ruang Pemeriksaan"
            },
            {
                img: "Assets/Fasilitas/ruang-tunggu.jpg",
                title: "Ruang Tunggu Nyaman"
            },
            {
                img: "Assets/Fasilitas/ruangan-klinik.jpg",
                title: "Ruangan Klinik"
            },
            {
                img: "Assets/Fasilitas/ruang-bermain.jpg",
                title: "Ruang Bermain"
            },
            {
                img: "Assets/Fasilitas/depan-klinik.jpg",
                title: "Depan Klinik"
            }
        ];

        // Pastikan kontainer siap menampung panjang tak terbatas dengan jarak antar foto (gap-6 = 24px)
        galleryCarousel.className = "flex items-stretch gap-6 w-max px-5";

        // 2. Gandakan array database agar layar langsung penuh dari awal (3x putaran)
        const extendedDatabase = [...galleryDatabase, ...galleryDatabase, ...galleryDatabase];

        // 3. Render HTML (Dengan penyesuaian Tinggi Tetap & Lebar Otomatis)
        extendedDatabase.forEach(item => {
            const cardHTML = `
                <div class="relative group overflow-hidden rounded-3xl h-[250px] md:h-[350px] w-auto shrink-0 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
                    <img src="${item.img}" alt="${item.title}" class="h-full w-auto object-cover group-hover:scale-105 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <h4 class="text-white font-bold text-lg md:text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">${item.title}</h4>
                    </div>
                </div>
            `;
            galleryCarousel.insertAdjacentHTML('beforeend', cardHTML);
        });

        // 4. Logika Infinite Marquee (Mengalir seperti air)
        let trackX = 0;
        let isGalleryHovered = false;
        const gapSize = 24; // Dari class Tailwind 'gap-6' (1.5rem = 24px)

        function animateGalleryMarquee() {
            if (!isGalleryHovered) {
                trackX -= 1; // Kecepatan mengalir (Ubah angka ini jika ingin lebih cepat/lambat, misal -1.5)
                
                // Ambil elemen foto yang sedang berada paling depan
                const firstItem = galleryCarousel.children[0];
                const itemTotalWidth = firstItem.offsetWidth + gapSize;

                // Jika foto paling depan sudah sepenuhnya tenggelam ke luar layar kiri...
                if (Math.abs(trackX) >= itemTotalWidth) {
                    // Curi foto tersebut dan lempar ke antrean paling belakang
                    galleryCarousel.appendChild(firstItem);
                    // Reset posisi geseran seketika agar tidak terasa ada lompatan visual
                    trackX += itemTotalWidth;
                }
                
                galleryCarousel.style.transform = `translateX(${trackX}px)`;
            }
            // Panggil fungsi ini terus-menerus 60 frame per detik
            requestAnimationFrame(animateGalleryMarquee);
        }

        // Nyalakan mesin animasi
        requestAnimationFrame(animateGalleryMarquee);

        // Fitur tambahan: Berhenti mengalir saat di-hover/disentuh (agar enak dilihat)
        galleryCarousel.addEventListener('mouseenter', () => isGalleryHovered = true);
        galleryCarousel.addEventListener('mouseleave', () => isGalleryHovered = false);
        
        galleryCarousel.addEventListener('touchstart', () => isGalleryHovered = true, {passive: true});
        galleryCarousel.addEventListener('touchend', () => isGalleryHovered = false);
    }

// === 12. LOGIKA FORM KE WHATSAPP (GRUP EDUKASI) ===
    const formGrupWa = document.getElementById('form-grup-wa');

    if (formGrupWa) {
        formGrupWa.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah halaman reload saat form dikirim

            // Ambil data dari inputan
            const nama = document.getElementById('namaBunda').value.trim();
            const usia = document.getElementById('usiaAnakKandungan').value.trim();
            const domisili = document.getElementById('domisili').value.trim();

            // Nomor WA Tujuan (Bidan Desy)
            const waNumber = "6281327189900";

            // Susun template pesan
            const waMessage = `Halo Bidan Desy, saya ingin bergabung dengan Grup Edukasi WA gratis. Berikut data diri saya:%0A%0A` +
                              `*Nama:* ${nama}%0A` +
                              `*Usia Kandungan/Anak:* ${usia}%0A` +
                              `*Domisili:* ${domisili}%0A%0A` +
                              `Mohon info link grupnya ya. Terima kasih! 🙏`;

            // Arahkan ke WhatsApp
            const waLink = `https://api.whatsapp.com/send/?phone=${waNumber}&text=${waMessage}`;
            window.open(waLink, '_blank');
        });
    }