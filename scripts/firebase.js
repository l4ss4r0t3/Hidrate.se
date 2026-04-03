import { initializeApp } from 'firebase/app';
    import { 
      getAuth, 
      GoogleAuthProvider, 
      signInWithPopup,
      signInWithCredential,
      signOut, 
      onAuthStateChanged 
    } from 'firebase/auth';
    import { 
      initializeFirestore,
      persistentLocalCache,
      persistentMultipleTabManager, 
      doc, 
      setDoc, 
      updateDoc, 
      getDoc, 
      getDocs, 
      collection,
      onSnapshot, 
      increment 
    } from 'firebase/firestore';

    import { firebaseConfig } from '../scripts/config.js';

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
    })
    });

    const provider = new GoogleAuthProvider();

    window.fazerLogin = async function() {
      
      if (window.isAndroidApp && window.isAndroidApp()) {
        console.log('📱 Solicitando login via Android...');
        AndroidAuth.requestLogin();
        return;
      }

      try {
        const resultado = await signInWithPopup(auth, provider);

        const fotoPerfil = document.getElementById('foto-perfil');
const nomePerfil = document.getElementById('nome-perfil');
if (fotoPerfil) fotoPerfil.src = (user.photoURL || '').replace('s96-c', 's400-c');
if (nomePerfil) nomePerfil.textContent = user.displayName;

        console.log('✅ Login realizado com sucesso');
      } catch (erro) {
        console.error('❌ Erro no login:', erro);
        alert('Erro ao fazer login. Tente novamente.');
      }

    };

    window.fazerLogout = async function() {
      if (window.isAndroidApp && window.isAndroidApp()) {
        AndroidAuth.requestLogout();
      }

      try {
        await signOut(auth);
        console.log('👋 Logout realizado');
      } catch (erro) {
        console.error('❌ Erro no logout:', erro);
      }
    };

    window.addEventListener('androidAuthReady', async (event) => {
  const { token, email, uid } = event.detail;
  
  console.log('📱 Auth Android recebida');
  
  setTimeout(() => {
    if (window.escutarUsuario) {
      const userMock = { uid, email };
      window.escutarUsuario(userMock);
      
      const btnAuth = document.getElementById('btn-auth');
      if (btnAuth) {
        btnAuth.textContent = "Sair (Google)";
        btnAuth.onclick = window.fazerLogout;
      }
      
      const authWarning = document.getElementById('auth-warning');
      if (authWarning) authWarning.style.display = 'none';
      
      console.log('✅ Escutando Firestore do usuário');
    }
  }, 500);
});
    
    let unsubscribe = null;

    onAuthStateChanged(auth, (user) => {
      const btnAuth = document.getElementById('btn-auth');
      const authWarning = document.getElementById('auth-warning');
   
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
   
      if (user) {

        const fotoPerfil = document.getElementById('foto-perfil');
const nomePerfil = document.getElementById('nome-perfil');
if (fotoPerfil) fotoPerfil.src = (user.photoURL || '').replace('s96-c', 's400-c');
if (nomePerfil) nomePerfil.textContent = user.displayName;
       
        if (btnAuth) {
          btnAuth.textContent = "Sair (Google)";
          btnAuth.onclick = window.fazerLogout;
        }
   
        if (authWarning) authWarning.style.display = 'none';
        escutarUsuario(user);
   
      } else {
        
        if (btnAuth) {
          btnAuth.textContent = "Login com Google";
          btnAuth.onclick = window.fazerLogin;
        }
   
        if (authWarning) authWarning.style.display = 'block';
   
        if (window.totalBebido > 0 || window.metaDiaria !== 2000) {
          if (typeof window.salvarNoLocalStorage === 'function') {
            window.salvarNoLocalStorage();
            console.log('💾 Dados salvos no localStorage ao deslogar');
          }
        }
   
        if (typeof window.carregarDoLocalStorage === 'function') {
          window.carregarDoLocalStorage();
        }
   
        resetarEstado();
      }
    });

    function escutarUsuario(user) {
      const userRef = doc(db, "usuarios", user.uid);
   
      unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const dados = docSnap.data();
          window.totalBebido = dados.totalBebido || 0;
          window.metaDiaria = dados.metaDiaria || 2000;
          atualizarUI();
   
        } else {
          const dadosLocal = localStorage.getItem('hidratese_dados');
          let dadosIniciais = {
            totalBebido: 0,
            metaDiaria: 2000
          };
   
          if (dadosLocal) {
            try {
              const dadosParsed = JSON.parse(dadosLocal);
              dadosIniciais = {
                totalBebido: dadosParsed.totalBebido || 0,
                metaDiaria: dadosParsed.metaDiaria || 2000
              };
              console.log('📤 Migrando dados do localStorage para Firebase:', dadosIniciais);
            } catch (e) {
              console.error('Erro ao migrar localStorage:', e);
            }
          }
   
          setDoc(userRef, dadosIniciais);
          
          if (typeof window.limparLocalStorage === 'function') {
            window.limparLocalStorage();
          }
        }
      });
    }

    function atualizarUI() {
      if (typeof window.atualizarVisual === 'function') {
        window.atualizarVisual();
      }
   
      const inputMeta = document.getElementById('meta-input');
      if (inputMeta) inputMeta.value = window.metaDiaria;
    }

    function resetarEstado() {
      if (typeof window.atualizarVisual === 'function') {
        window.atualizarVisual();
      }
      
      const inputMeta = document.getElementById('meta-input');
      if (inputMeta) inputMeta.value = window.metaDiaria;
    }

    window.db = db;
    window.auth = auth;
    window.updateDoc = updateDoc;
    window.doc = doc;
    window.increment = increment;
    window.escutarUsuario = escutarUsuario;
    window.setDoc = setDoc;
    window.getDoc = getDoc;
window.getDocs = getDocs;
window.collection = collection;