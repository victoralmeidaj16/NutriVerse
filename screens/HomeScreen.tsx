import React, { useMemo } from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// ————— THEME —————
const COLORS = {
  lime: '#9BE000',
  petrol: '#0F3D3E',
  orbit: '#6A4AF0',
  bg: '#0B0B0D',
  card: '#16161B',
  text: '#FFFFFF',
  sub: '#A5A7B0',
  border: '#2A2A30',
};

const SPACING = 16;

// ————— COMPONENTS —————
const MacroRing: React.FC<{ size?: number; stroke?: number; progress?: number; label: string; value: string; }> = ({ size = 92, stroke = 10, progress = 0.7, label, value }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = useMemo(() => circumference * (1 - progress), [progress, circumference]);

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={size/2} cy={size/2} r={radius} stroke={COLORS.border} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke={COLORS.lime}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashoffset}
          fill="none"
          rotation="-90"
          originX={size/2}
          originY={size/2}
        />
      </Svg>
      <Text style={styles.macroValue}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
};

const CategoryChip: React.FC<{ title: string; icon?: keyof typeof Ionicons.glyphMap }>=({ title, icon='fast-food-outline' })=> (
  <TouchableOpacity style={styles.chip} activeOpacity={0.9}>
    <Ionicons name={icon as any} size={16} color={COLORS.text} style={{ marginRight: 6 }} />
    <Text style={styles.chipText}>{title}</Text>
  </TouchableOpacity>
);

const SectionHeader: React.FC<{ title: string; cta?: string; onPress?: () => void }>=({ title, cta = 'Ver tudo', onPress })=> (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onPress && (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.sectionCTA}>{cta}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const RecipeCard: React.FC<{ title: string; kcal: number; protein: number; image: string }>=({ title, kcal, protein, image })=> (
  <TouchableOpacity style={styles.recipeCard} activeOpacity={0.95}>
    <Image source={{ uri: image }} style={StyleSheet.absoluteFillObject as any} />
    <LinearGradient colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.6)"]} style={StyleSheet.absoluteFill} />
    <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12, flexDirection:'row', alignItems:'center' }}>
      <MaterialCommunityIcons name="fire" size={14} color={COLORS.lime} />
      <Text style={{ color: COLORS.text, marginLeft: 6, fontWeight: '600' }}>{kcal} kcal • {protein}g P</Text>
    </View>
    <View style={{ position:'absolute', bottom: 12, left: 12, right: 12 }}>
      <Text style={styles.recipeTitle} numberOfLines={2}>{title}</Text>
      <View style={{ flexDirection:'row', marginTop: 10 }}>
        <TouchableOpacity style={styles.ctaPrimary}>
          <Ionicons name="flash-outline" size={16} color="#0B0B0D" />
          <Text style={styles.ctaPrimaryText}>Cozinhar agora</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaGhost}>
          <Ionicons name="add-circle-outline" size={18} color={COLORS.text} />
          <Text style={styles.ctaGhostText}>Plano</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaGhost}>
          <Ionicons name="cart-outline" size={18} color={COLORS.text} />
          <Text style={styles.ctaGhostText}>Lista</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const TipCard: React.FC<{ text: string }>=({ text })=> (
  <View style={styles.tipCard}>
    <Ionicons name="bulb-outline" size={18} color={COLORS.lime} />
    <Text style={styles.tipText}>{text}</Text>
    <TouchableOpacity>
      <Ionicons name="close" size={16} color={COLORS.sub} />
    </TouchableOpacity>
  </View>
);

const ChallengeCard: React.FC<{ title: string; sponsor?: string; daysLeft: number }>=({ title, sponsor, daysLeft })=> (
  <LinearGradient colors={[COLORS.card, '#1E1E25']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.challengeCard}>
    <View style={{ flexDirection:'row', alignItems:'center' }}>
      <Ionicons name="trophy-outline" size={18} color={COLORS.orbit} />
      <Text style={styles.challengeTitle}>{title}</Text>
      {sponsor && <Text style={styles.challengeSponsor}> • {sponsor}</Text>}
    </View>
    <View style={{ flexDirection:'row', alignItems:'center', marginTop: 8 }}>
      <Ionicons name="time-outline" size={16} color={COLORS.sub} />
      <Text style={styles.challengeSub}>{daysLeft} dias restantes</Text>
    </View>
    <TouchableOpacity style={styles.challengeCTA}>
      <Text style={styles.challengeCTAText}>Participar</Text>
    </TouchableOpacity>
  </LinearGradient>
);

const BottomTabs: React.FC<{ activeTab: number; onTabPress: (index: number) => void }> = ({ activeTab, onTabPress }) => (
  <View style={styles.tabs}>
    {[
      { icon: 'home-outline', label: 'Início' },
      { icon: 'calendar-outline', label: 'Planejar' },
      { icon: 'add-circle', label: 'Registrar', big:true },
      { icon: 'people-outline', label: 'Comunidade' },
    ].map((t, idx) => (
      <TouchableOpacity key={idx} style={styles.tabItem} activeOpacity={0.9} onPress={() => onTabPress(idx)}>
        {t.big ? (
          <View style={styles.fab}>
            <Ionicons name={t.icon as any} size={28} color={'#0B0B0D'} />
          </View>
        ) : (
          <>
            <Ionicons name={t.icon as any} size={22} color={idx===activeTab ? COLORS.lime : COLORS.sub} />
            <Text style={[styles.tabLabel, idx===activeTab && { color: COLORS.lime }]}>{t.label}</Text>
          </>
        )}
      </TouchableOpacity>
    ))}
  </View>
);

// ————— DATA (mock) —————
const CATEGORIES = [
  { title: 'Café da manhã', icon: 'cafe-outline' },
  { title: 'Almoço rápido', icon: 'fast-food-outline' },
  { title: 'Pré-treino', icon: 'barbell-outline' },
  { title: 'Pós-treino', icon: 'fitness-outline' },
  { title: 'Snacks', icon: 'ice-cream-outline' },
];

const REELS = [
  { id: '1', title: 'Omelete proteico em 30s', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop' },
  { id: '2', title: 'Bowl de frango e quinoa', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop' },
  { id: '3', title: 'Smoothie verde turbo', image: 'https://images.unsplash.com/photo-1484980859177-5ac1249fda1e?q=80&w=1200&auto=format&fit=crop' },
];

// ————— SCREEN —————
interface TestNutritionScreenProps {
  navigate: (screen: string) => void;
}

const TestNutritionScreen: React.FC<TestNutritionScreenProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  
  const handleTabPress = (index: number) => {
    setActiveTab(index);
    if (index === 1) {
      navigate('Plan');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hi}>Bom dia, Alex</Text>
            <Text style={styles.subtitle}>Restam 820 kcal hoje</Text>
          </View>
          <View style={{ flexDirection:'row', gap: 14 }}>
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigate('Wireframe')}>
              <Ionicons name="layers-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="settings-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Macro rings */}
        <View style={styles.ringsRow}>
          <MacroRing label="Proteína" value="78g" progress={0.62} />
          <MacroRing label="Carbo" value="155g" progress={0.48} />
          <MacroRing label="Gordura" value="42g" progress={0.54} />
        </View>

        {/* Recipe of the day */}
        <SectionHeader title="Receita do dia" />
        <RecipeCard
          title="Frango ao pesto com abobrinha e quinoa"
          kcal={520}
          protein={42}
          image="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1200&auto=format&fit=crop"
        />

        {/* Quick tip */}
        <TipCard text="Dica: tente 30–35g de proteína no café para reduzir o apetite no almoço." />

        {/* Challenge */}
        <SectionHeader title="Desafio da semana" />
        <ChallengeCard title="7 dias batendo proteína" sponsor="WheyCorp" daysLeft={5} />

        {/* Categories */}
        <SectionHeader title="Categorias rápidas" />
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => <CategoryChip title={item.title} icon={item.icon as any} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING }}
          style={{ marginTop: 6, marginBottom: 12 }}
        />

        {/* Reels style list (vertical) */}
        <SectionHeader title="Rápidos para hoje" />
        <View style={{ paddingHorizontal: SPACING, gap: 16 }}>
          {REELS.map(r => (
            <TouchableOpacity key={r.id} style={styles.reel} activeOpacity={0.95}>
              <Image source={{ uri: r.image }} style={StyleSheet.absoluteFillObject as any} />
              <LinearGradient colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.7)"]} style={StyleSheet.absoluteFill} />
              <Ionicons name="play-circle" size={48} color={COLORS.lime} style={{ position:'absolute', top: 12, right: 12 }} />
              <Text style={styles.reelTitle}>{r.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Tabs */}
      <BottomTabs activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default TestNutritionScreen;

// ————— STYLES —————
const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor: COLORS.bg },
  container: { flex:1 },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal: SPACING, paddingTop: 6, paddingBottom: 12 },
  hi: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: COLORS.sub, marginTop: 4 },
  headerIcon: { width:42, height:42, borderRadius:12, borderWidth:1, borderColor: COLORS.border, alignItems:'center', justifyContent:'center', backgroundColor: COLORS.card },

  ringsRow: { flexDirection:'row', justifyContent:'space-around', paddingHorizontal: SPACING, marginTop: 8, marginBottom: 18 },
  macroValue: { position:'absolute', top: 32, color: COLORS.text, fontWeight:'700', fontSize: 14 },
  macroLabel: { color: COLORS.sub, fontSize: 12, marginTop: 6 },

  sectionHeader: { paddingHorizontal: SPACING, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop: 8, marginBottom: 8 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  sectionCTA: { color: COLORS.sub, fontSize: 14 },

  recipeCard: { height: 220, marginHorizontal: SPACING, borderRadius: 20, overflow: 'hidden', borderWidth:1, borderColor: COLORS.border, backgroundColor: COLORS.card },
  recipeTitle: { color: COLORS.text, fontSize: 18, fontWeight:'800' },
  ctaPrimary: { backgroundColor: COLORS.lime, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, flexDirection:'row', alignItems:'center', gap: 6, marginRight: 10 },
  ctaPrimaryText: { color: '#0B0B0D', fontWeight:'800', fontSize: 12 },
  ctaGhost: { borderWidth:1, borderColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, marginRight: 10, flexDirection:'row', alignItems:'center', gap: 6 },
  ctaGhostText: { color: COLORS.text, fontWeight:'600', fontSize: 12 },

  tipCard: { marginHorizontal: SPACING, marginTop: 12, backgroundColor: COLORS.card, borderRadius: 16, borderWidth:1, borderColor: COLORS.border, padding: 12, flexDirection:'row', alignItems:'center', gap: 10 },
  tipText: { color: COLORS.text, flex:1, fontSize: 13 },

  challengeCard: { marginHorizontal: SPACING, borderRadius: 16, padding: 14, borderWidth:1, borderColor: COLORS.border, marginTop: 12 },
  challengeTitle: { color: COLORS.text, fontWeight:'700', marginLeft: 8, fontSize: 15 },
  challengeSponsor: { color: COLORS.sub, fontWeight:'600' },
  challengeSub: { color: COLORS.sub, marginLeft: 6, fontSize: 13 },
  challengeCTA: { alignSelf:'flex-start', marginTop: 12, backgroundColor: COLORS.orbit, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  challengeCTAText: { color:'#fff', fontWeight:'800', fontSize: 13 },

  chip: { flexDirection:'row', alignItems:'center', backgroundColor: COLORS.card, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, marginRight: 10, borderWidth:1, borderColor: COLORS.border },
  chipText: { color: COLORS.text, fontWeight:'600', fontSize: 13 },

  reel: { height: 240, borderRadius: 20, overflow:'hidden', borderWidth:1, borderColor: COLORS.border, backgroundColor: COLORS.card },
  reelTitle: { position:'absolute', bottom: 12, left: 12, right: 12, color: COLORS.text, fontSize: 16, fontWeight:'700' },

  tabs: { position:'absolute', left: SPACING, right: SPACING, bottom: 20, height: 68, backgroundColor: 'rgba(22,22,27,0.92)', borderRadius: 22, borderWidth:1, borderColor: COLORS.border, flexDirection:'row', justifyContent:'space-around', alignItems:'center', paddingHorizontal: 12 },
  tabItem: { alignItems:'center', justifyContent:'center', gap: 4, flex:1 },
  tabLabel: { color: COLORS.sub, fontSize: 11 },
  fab: { width: 56, height: 56, borderRadius: 999, backgroundColor: COLORS.lime, alignItems:'center', justifyContent:'center', marginTop: -30, shadowColor:'#000', shadowOpacity:0.3, shadowOffset:{ width:0, height:10 }, shadowRadius:16, elevation:8 },
});

