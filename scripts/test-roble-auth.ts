import axios from 'axios';

const ROBLE_PROJECT_TOKEN = process.env.ROBLE_PROJECT_TOKEN || 'trueque_29b341a61b';
const ROBLE_API_URL = process.env.ROBLE_API_URL || 'https://roble-api.openlab.uninorte.edu.co';

async function testRobleAuth() {
  console.log('🔐 Probando autenticación de ROBLE...\n');

  console.log('1️⃣  Registrando usuario de prueba...\n');
  
  try {
    const signupUrl = `${ROBLE_API_URL}/auth/${ROBLE_PROJECT_TOKEN}/signup-direct`;
    
    const signupData = {
      email: 'test@trueque.com',
      password: 'Test@1234',
      name: 'Usuario de Prueba',
    };

    const signupResponse = await axios.post(signupUrl, signupData);
    console.log('✅ Usuario registrado:', signupResponse.data);
    
    if (signupResponse.data.token) {
      console.log('🔑 Token recibido:', signupResponse.data.token);
    }
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log('ℹ️  Usuario ya existe, intentando login...');
    } else {
      console.error('❌ Error en signup:', error.response?.data || error.message);
    }
  }

  console.log('\n2️⃣  Iniciando sesión...\n');
  
  try {
    const loginUrl = `${ROBLE_API_URL}/auth/${ROBLE_PROJECT_TOKEN}/login`;
    
    const loginData = {
      email: 'test@trueque.com',
      password: 'Test@1234',
    };

    const loginResponse = await axios.post(loginUrl, loginData);
    console.log('✅ Login exitoso:', loginResponse.data);
    
    if (loginResponse.data.token) {
      const token = loginResponse.data.token;
      console.log('🔑 Token JWT:', token);

      console.log('\n3️⃣  Verificando token...\n');
      
      const verifyUrl = `${ROBLE_API_URL}/auth/${ROBLE_PROJECT_TOKEN}/verify`;
      const verifyResponse = await axios.post(verifyUrl, { token });
      console.log('✅ Token verificado:', verifyResponse.data);
    }
  } catch (error: any) {
    console.error('❌ Error en login:', error.response?.data || error.message);
  }

  console.log('\n✅ Prueba de autenticación completada!');
}

testRobleAuth().catch(console.error);

