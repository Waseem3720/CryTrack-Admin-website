// ============================================
// adminBackend/seed.js
// Run: node seed.js
// ============================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Import models
const Admin = require('./src/models/Admin');
const User = require('./src/models/User');
const Baby = require('./src/models/Baby');
const Tutorial = require('./src/models/Tutorial');
const CryRecord = require('./src/models/CryRecord');
const Routine = require('./src/models/Routine');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const adminsData = [
  {
    name: 'Admin User',
    email: 'admin@crytrack.com',
    password: 'admin123'
  },
  {
    name: 'Super Admin',
    email: 'superadmin@crytrack.com',
    password: 'super123'
  }
];

const usersData = [
  {
    name: 'Parent 1',
    email: 'parent1@example.com',
    password: 'password123'
  },
  {
    name: 'Parent 2',
    email: 'parent2@example.com',
    password: 'password123'
  },
  {
    name: 'Parent 3',
    email: 'parent3@example.com',
    password: 'password123'
  }
];

const tutorialsData = [
  {
    title: 'Hunger',
    category: 'Hunger',
    video_link: 'https://example.com/hunger-tutorial',
    description: 'Learn how to identify and respond to hunger cries'
  },
  {
    title: 'Pain',
    category: 'Pain',
    video_link: 'https://example.com/pain-tutorial',
    description: 'Understanding pain-related crying patterns'
  },
  {
    title: 'Discomfort',
    category: 'Discomfort',
    video_link: 'https://example.com/discomfort-tutorial',
    description: 'How to soothe a baby experiencing discomfort'
  },
  {
    title: 'Sleep',
    category: 'Sleep',
    video_link: 'https://example.com/sleep-tutorial',
    description: 'Tips for identifying tired baby cries'
  },
  {
    title: 'Feeding Tips',
    category: 'Feeding',
    video_link: 'https://example.com/feeding-tutorial',
    description: 'Best practices for feeding your baby'
  },
  {
    title: 'Diaper Change',
    category: 'Hygiene',
    video_link: 'https://example.com/diaper-tutorial',
    description: 'Step-by-step diaper changing guide'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🗑️  Clearing existing data...');

    // Clear existing data
    await Admin.deleteMany();
    await User.deleteMany();
    await Baby.deleteMany();
    await Tutorial.deleteMany();
    await CryRecord.deleteMany();
    await Routine.deleteMany();

    console.log('✅ All collections cleared!');
    console.log('');

    // ========================================
    // 1. Seed Admins
    // ========================================
    console.log('👤 Seeding Admins...');
    
    const hashedAdmins = await Promise.all(
      adminsData.map(async (admin) => ({
        ...admin,
        password: await bcrypt.hash(admin.password, 12)
      }))
    );

    const admins = await Admin.insertMany(hashedAdmins);
    console.log(`✅ ${admins.length} Admins created`);
    console.log('   Admin Credentials:');
    adminsData.forEach((admin) => {
      console.log(`   📧 ${admin.email} | 🔑 ${admin.password}`);
    });
    console.log('');

    // ========================================
    // 2. Seed Users (Parents)
    // ========================================
    console.log('👥 Seeding Users (Parents)...');
    
    const hashedUsers = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    const users = await User.insertMany(hashedUsers);
    console.log(`✅ ${users.length} Users created`);
    console.log('   User Credentials:');
    usersData.forEach((user) => {
      console.log(`   📧 ${user.email} | 🔑 ${user.password}`);
    });
    console.log('');

    // ========================================
    // 3. Seed Babies
    // ========================================
    console.log('👶 Seeding Babies...');
    
    const babiesData = [
      {
        user_id: users[0]._id,
        name: 'Child 1A',
        dob: new Date('2023-06-15'),
        gender: 'male'
      },
      {
        user_id: users[0]._id,
        name: 'Child 1B',
        dob: new Date('2024-01-20'),
        gender: 'female'
      },
      {
        user_id: users[1]._id,
        name: 'Child 2A',
        dob: new Date('2023-09-10'),
        gender: 'female'
      },
      {
        user_id: users[2]._id,
        name: 'Child 3A',
        dob: new Date('2024-03-05'),
        gender: 'male'
      }
    ];

    const babies = await Baby.insertMany(babiesData);
    console.log(`✅ ${babies.length} Babies created`);
    babies.forEach((baby, index) => {
      console.log(`   👶 ${baby.name} - Parent: ${usersData[Math.floor(index / 2)].name}`);
    });
    console.log('');

    // ========================================
    // 4. Seed Tutorials
    // ========================================
    console.log('📚 Seeding Tutorials...');
    
    const tutorials = await Tutorial.insertMany(tutorialsData);
    console.log(`✅ ${tutorials.length} Tutorials created`);
    tutorials.forEach((tutorial) => {
      console.log(`   📖 ${tutorial.category} - ${tutorial.title}`);
    });
    console.log('');

    // ========================================
    // 5. Seed Cry Records
    // ========================================
    console.log('🎤 Seeding Cry Records...');
    
    const cryRecordsData = [
      {
        baby_id: babies[0]._id,
        timestamp: new Date('2024-11-20T10:30:00'),
        audio_file_path: 'uploads/audio/cry-sample-1.wav',
        confidence_score: 85,
        classification_result: 'hungry'
      },
      {
        baby_id: babies[0]._id,
        timestamp: new Date('2024-11-21T14:15:00'),
        audio_file_path: 'uploads/audio/cry-sample-2.wav',
        confidence_score: 92,
        classification_result: 'tired'
      },
      {
        baby_id: babies[1]._id,
        timestamp: new Date('2024-11-22T09:45:00'),
        audio_file_path: 'uploads/audio/cry-sample-3.wav',
        confidence_score: 78,
        classification_result: 'discomfort'
      },
      {
        baby_id: babies[2]._id,
        timestamp: new Date('2024-11-23T16:20:00'),
        audio_file_path: 'uploads/audio/cry-sample-4.wav',
        confidence_score: 88,
        classification_result: 'pain'
      },
      {
        baby_id: babies[3]._id,
        timestamp: new Date('2024-11-24T11:00:00'),
        audio_file_path: 'uploads/audio/cry-sample-5.wav',
        confidence_score: 95,
        classification_result: 'hungry'
      }
    ];

    const cryRecords = await CryRecord.insertMany(cryRecordsData);
    console.log(`✅ ${cryRecords.length} Cry Records created`);
    cryRecords.forEach((record) => {
      console.log(`   🎤 ${record.classification_result} - Confidence: ${record.confidence_score}%`);
    });
    console.log('');

    // ========================================
    // 6. Seed Routines
    // ========================================
    console.log('⏰ Seeding Routines...');
    
    const routinesData = [
      {
        baby_id: babies[0]._id,
        routine_type: 'feeding',
        start_time: new Date('2024-11-27T08:00:00'),
        frequency: 'daily'
      },
      {
        baby_id: babies[0]._id,
        routine_type: 'sleeping',
        start_time: new Date('2024-11-27T13:00:00'),
        frequency: 'daily'
      },
      {
        baby_id: babies[1]._id,
        routine_type: 'feeding',
        start_time: new Date('2024-11-27T09:00:00'),
        frequency: 'daily'
      },
      {
        baby_id: babies[1]._id,
        routine_type: 'bath',
        start_time: new Date('2024-11-27T19:00:00'),
        frequency: 'daily'
      },
      {
        baby_id: babies[2]._id,
        routine_type: 'feeding',
        start_time: new Date('2024-11-27T07:30:00'),
        frequency: 'daily'
      },
      {
        baby_id: babies[3]._id,
        routine_type: 'playtime',
        start_time: new Date('2024-11-27T15:00:00'),
        frequency: 'daily'
      }
    ];

    const routines = await Routine.insertMany(routinesData);
    console.log(`✅ ${routines.length} Routines created`);
    routines.forEach((routine) => {
      console.log(`   ⏰ ${routine.routine_type} - ${routine.frequency}`);
    });
    console.log('');

    // ========================================
    // Summary
    // ========================================
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('          🎉 SEEDING COMPLETED! 🎉         ');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('📊 Database Summary:');
    console.log(`   👤 Admins: ${admins.length}`);
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   👶 Babies: ${babies.length}`);
    console.log(`   📚 Tutorials: ${tutorials.length}`);
    console.log(`   🎤 Cry Records: ${cryRecords.length}`);
    console.log(`   ⏰ Routines: ${routines.length}`);
    console.log('');
    console.log('🔐 Test Credentials:');
    console.log('');
    console.log('   Admin Login:');
    console.log('   📧 admin@crytrack.com');
    console.log('   🔑 admin123');
    console.log('');
    console.log('   Parent Login:');
    console.log('   📧 parent1@example.com');
    console.log('   🔑 password123');
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();


// ============================================
// ALTERNATIVE: seed-simple.js (Only Admins & Users)
// Run: node seed-simple.js
// ============================================


dotenv.config();

//const Admin = require('./src/models/Admin');
//const User = require('./src/models/User');

const seedSimple = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear
    await Admin.deleteMany();
    await User.deleteMany();

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 12);
    await Admin.create({
      name: 'Admin',
      email: 'admin@crytrack.com',
      password: adminPassword
    });

    // Create Parent
    const parentPassword = await bcrypt.hash('password123', 12);
    await User.create({
      name: 'Test Parent',
      email: 'parent@example.com',
      password: parentPassword
    });

    console.log('✅ Simple seed completed!');
    console.log('Admin: admin@crytrack.com / admin123');
    console.log('Parent: parent@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

