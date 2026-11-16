const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

createApp({
    setup() {
        // --- MENU MOBILE ---
        const isMobileMenuOpen = ref(false);
        const toggleMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; };
        const closeMenu = () => { isMobileMenuOpen.value = false; };

        // --- DÉTECTION DE LA SECTION ACTIVE (SCROLL) ---
        const activeSection = ref('accueil');
        let observer = null;

        onMounted(() => {
            const sections = document.querySelectorAll('section[id]');
            
            const options = {
                root: null,
                // Déclenche quand la section traverse le tiers supérieur de l'écran
                rootMargin: '-20% 0px -60% 0px', 
                threshold: 0
            };

            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        activeSection.value = entry.target.id;
                    }
                });
            }, options);

            sections.forEach(section => {
                observer.observe(section);
            });
        });

        onUnmounted(() => {
            if (observer) observer.disconnect();
        });

        // --- DONNÉES PROJETS ---
        const currentFilter = ref('all');
        const filters = [
            { label: 'Tout', value: 'all' },
            { label: 'Développement', value: 'dev' },
            { label: 'Infrastructure', value: 'infra' },
            { label: 'Design', value: 'design' },
            { label: 'Data', value: 'data' }
        ];

        const projects = ref([
            {
                id: 1,
                title: 'EcoShield Gabon',
                description: 'Dashboard de surveillance environnementale interactive pour le Gabon.',
                category: ['dev', 'data'],
                status: 'Terminé',
                statusClass: 'status-done',
                image: './photos/EcoShield _ Sentinelle de la forêt_format.png',
                tags: ['Web', 'Open Data', 'Data Viz'],
                link: 'https://calinesdras-pixel.github.io/EcoShield_v1/'
            },
            {
                id: 2,
                title: 'Cloud_Acad',
                description: 'Infrastructure Cloud & Plateforme pédagogique pour la formation.',
                category: ['infra', 'dev'],
                status: 'Terminé',
                statusClass: 'status-done',
                image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop',
                tags: ['Cloud', 'DevOps', 'Management']
            },
            {
                id: 3,
                title: 'Système RESTful',
                description: 'Gestion des formations et inscriptions via une API Node.js.',
                category: ['dev', 'data'],
                status: 'Fonctionnel',
                statusClass: 'status-func',
                image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop',
                tags: ['Node.js', 'Express', 'MySQL']
            },
            {
                id: 4,
                title: 'Identité visuelle & DA',
                description: 'Projets de branding et direction artistique (Chic en JESUS, etc.).',
                category: ['design'],
                status: 'Terminé',
                statusClass: 'status-done',
                image: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=800&auto=format&fit=crop',
                tags: ['Design', 'Branding', 'UI/UX']
            },
            {
                id: 5,
                title: 'Infrastructure Réseau',
                description: 'Laboratoire technique complet de virtualisation et administration.',
                category: ['infra'],
                status: 'En cours',
                statusClass: 'status-wip',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
                tags: ['Réseau', 'Sécurité', 'Virtualisation']
            }
        ]);

        // --- FILTRAGE ---
        const filteredProjects = computed(() => {
            if (currentFilter.value === 'all') return projects.value;
            return projects.value.filter(project => project.category.includes(currentFilter.value));
        });

        // --- LOGIQUE DU FORMULAIRE DE CONTACT (WEB3FORMS) ---
        const form = ref({ name: '', email: '', message: '' });
        const isSubmitting = ref(false);
        const formStatus = ref({ type: '', message: '' });

        const submitForm = async () => {
            if (!form.value.name || !form.value.email || !form.value.message) {
                formStatus.value = { type: 'error', message: 'Veuillez remplir tous les champs.' };
                return;
            }

            isSubmitting.value = true;
            formStatus.value = { type: '', message: '' };

            const formData = new FormData();
            formData.append("access_key", "4dfdac33-ca92-4a3b-878e-ab9228b612a1");
            formData.append("name", form.value.name);
            formData.append("email", form.value.email);
            formData.append("message", form.value.message);

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    formStatus.value = { type: 'success', message: 'Message envoyé avec succès ! Je vous répondrai très vite.' };
                    form.value = { name: '', email: '', message: '' }; 
                } else {
                    formStatus.value = { type: 'error', message: data.message || "Une erreur est survenue lors de l'envoi." };
                }

            } catch (error) {
                formStatus.value = { type: 'error', message: "Impossible d'envoyer le message. Vérifiez votre connexion." };
            } finally {
                isSubmitting.value = false;
                setTimeout(() => {
                    formStatus.value.message = '';
                }, 5000);
            }
        };

        // --- RETOUR POUR LE TEMPLATE HTML ---
        return {
            isMobileMenuOpen, toggleMenu, closeMenu,
            activeSection, // <-- Ajouté ici
            currentFilter, filters, filteredProjects,
            form, isSubmitting, formStatus, submitForm
        };
    }
}).mount('#app');