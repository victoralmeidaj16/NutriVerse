import React, { useMemo } from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// ————— THEME —————
const COLORS = {
  bg: '#FFFFFF',
  card: '#F5F5F5',
  text: '#1A1A1A',
  sub: '#808080',
  border: '#E0E0E0',
  wireframe: '#CCCCCC',
  dark: '#666666',
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
          stroke={COLORS.dark}
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
    <View style={styles.chipIcon} />
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
    <View style={styles.imagePlaceholder}>
      <View style={styles.xMark}>
        <View style={[styles.xLine, { transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.xLine, { transform: [{ rotate: '-45deg' }] }]} />
      </View>
      <View style={styles.imageIcon} />
    </View>
    <View style={styles.recipeContent}>
      <View style={styles.recipeBadge}>
        <View style={styles.badgeIcon} />
        <Text style={styles.recipeBadgeText}>{kcal} kcal • {protein}g P</Text>
      </View>
      <Text style={styles.recipeTitle} numberOfLines={2}>{title}</Text>
      <View style={{ flexDirection:'row', marginTop: 10 }}>
        <TouchableOpacity style={styles.ctaPrimary}>
          <View style={styles.ctaIcon} />
          <Text style={styles.ctaPrimaryText}>Cozinhar agora</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaGhost}>
          <View style={styles.ctaIcon} />
          <Text style={styles.ctaGhostText}>Plano</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaGhost}>
          <View style={styles.ctaIcon} />
          <Text style={styles.ctaGhostText}>Lista</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const TipCard: React.FC<{ text: string }>=({ text })=> (
  <View style={styles.tipCard}>
    <View style={styles.tipIcon} />
    <Text style={styles.tipText}>{text}</Text>
    <TouchableOpacity>
      <View style={styles.closeIcon} />
    </TouchableOpacity>
  </View>
);

const ChallengeCard: React.FC<{ title: string; sponsor?: string; daysLeft: number }>=({ title, sponsor, daysLeft })=> (
  <View style={styles.challengeCard}>
    <View style={{ flexDirection:'row', alignItems:'center' }}>
      <View style={styles.challengeIcon} />
      <Text style={styles.challengeTitle}>{title}</Text>
      {sponsor && <Text style={styles.challengeSponsor}> • {sponsor}</Text>}
    </View>
    <View style={{ flexDirection:'row', alignItems:'center', marginTop: 8 }}>
      <View style={styles.timeIcon} />
      <Text style={styles.challengeSub}>{daysLeft} dias restantes</Text>
    </View>
    <TouchableOpacity style={styles.challengeCTA}>
      <Text style={styles.challengeCTAText}>Participar</Text>
    </TouchableOpacity>
  </View>
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
            <View style={styles.fabIcon} />
          </View>
        ) : (
          <>
            <View style={[styles.tabIcon, idx===activeTab && styles.tabIconActive]} />
            <Text style={[styles.tabLabel, idx===activeTab && styles.tabLabelActive]}>{t.label}</Text>
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
interface WireframeScreenProps {
  navigate: (screen: string) => void;
}

const WireframeScreen: React.FC<WireframeScreenProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  
  const handleTabPress = (index: number) => {
    setActiveTab(index);
    if (index === 1) {
      navigate('Plan');
    } else if (index === 0) {
      navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hi}>Bom dia, Alex</Text>
            <Text style={styles.subtitle}>Restam 820 kcal hoje</Text>
          </View>
          <View style={{ flexDirection:'row', gap: 14 }}>
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigate('Home')}>
              <View style={styles.headerIconCircle} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <View style={styles.headerIconCircle} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <View style={styles.headerIconCircle} />
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
              <View style={styles.reelImagePlaceholder}>
                <View style={styles.xMark}>
                  <View style={[styles.xLine, { transform: [{ rotate: '45deg' }] }]} />
                  <View style={[styles.xLine, { transform: [{ rotate: '-45deg' }] }]} />
                </View>
                <View style={styles.playIcon} />
              </View>
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

export default WireframeScreen;

// ————— STYLES —————
const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor: COLORS.bg },
  container: { flex:1 },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal: SPACING, paddingTop: 6, paddingBottom: 12 },
  hi: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: COLORS.sub, marginTop: 4 },
  headerIcon: { width:42, height:42, borderRadius:12, borderWidth:1, borderColor: COLORS.border, alignItems:'center', justifyContent:'center', backgroundColor: COLORS.card },
  headerIconCircle: { width:20, height:20, borderRadius:10, backgroundColor: COLORS.wireframe },

  ringsRow: { flexDirection:'row', justifyContent:'space-around', paddingHorizontal: SPACING, marginTop: 8, marginBottom: 18 },
  macroValue: { position:'absolute', top: 32, color: COLORS.text, fontWeight:'700', fontSize: 14 },
  macroLabel: { color: COLORS.sub, fontSize: 12, marginTop: 6 },

  sectionHeader: { paddingHorizontal: SPACING, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop: 8, marginBottom: 8 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  sectionCTA: { color: COLORS.sub, fontSize: 14 },

  recipeCard: { marginHorizontal: SPACING, borderRadius: 20, overflow: 'hidden', borderWidth:1, borderColor: COLORS.border, backgroundColor: COLORS.card },
  imagePlaceholder: { height: 140, backgroundColor: COLORS.wireframe, position: 'relative', justifyContent:'center', alignItems:'center' },
  xMark: { position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  xLine: { position: 'absolute', width: 60, height: 2, backgroundColor: COLORS.dark },
  imageIcon: { position:'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.dark },
  recipeContent: { padding: 12 },
  recipeBadge: { flexDirection:'row', alignItems:'center', marginBottom: 8, alignSelf:'flex-start', backgroundColor: COLORS.bg, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12 },
  badgeIcon: { width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.dark, marginRight: 6 },
  recipeBadgeText: { color: COLORS.text, fontWeight:'600', fontSize: 12 },
  recipeTitle: { color: COLORS.text, fontSize: 18, fontWeight:'800' },
  ctaPrimary: { backgroundColor: COLORS.dark, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, flexDirection:'row', alignItems:'center', gap: 6, marginRight: 10 },
  ctaPrimaryText: { color: COLORS.bg, fontWeight:'800', fontSize: 12 },
  ctaGhost: { borderWidth:1, borderColor: COLORS.border, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, marginRight: 10, flexDirection:'row', alignItems:'center', gap: 6 },
  ctaGhostText: { color: COLORS.text, fontWeight:'600', fontSize: 12 },
  ctaIcon: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.wireframe },

  tipCard: { marginHorizontal: SPACING, marginTop: 12, backgroundColor: COLORS.card, borderRadius: 16, borderWidth:1, borderColor: COLORS.border, padding: 12, flexDirection:'row', alignItems:'center', gap: 10 },
  tipIcon: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.dark },
  tipText: { color: COLORS.text, flex:1, fontSize: 13 },
  closeIcon: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.wireframe },

  challengeCard: { marginHorizontal: SPACING, borderRadius: 16, padding: 14, borderWidth:1, borderColor: COLORS.border, marginTop: 12, backgroundColor: COLORS.card },
  challengeIcon: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.dark },
  challengeTitle: { color: COLORS.text, fontWeight:'700', marginLeft: 8, fontSize: 15 },
  challengeSponsor: { color: COLORS.sub, fontWeight:'600' },
  timeIcon: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.wireframe },
  challengeSub: { color: COLORS.sub, marginLeft: 6, fontSize: 13 },
  challengeCTA: { alignSelf:'flex-start', marginTop: 12, backgroundColor: COLORS.dark, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  challengeCTAText: { color: COLORS.bg, fontWeight:'800', fontSize: 13 },

  chip: { flexDirection:'row', alignItems:'center', backgroundColor: COLORS.card, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, marginRight: 10, borderWidth:1, borderColor: COLORS.border },
  chipIcon: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.wireframe, marginRight: 6 },
  chipText: { color: COLORS.text, fontWeight:'600', fontSize: 13 },

  reel: { height: 240, borderRadius: 20, overflow:'hidden', borderWidth:1, borderColor: COLORS.border, backgroundColor: COLORS.card },
  reelImagePlaceholder: { flex:1, backgroundColor: COLORS.wireframe, position: 'relative', justifyContent:'center', alignItems:'center' },
  playIcon: { position:'absolute', top: 12, right: 12, width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.dark },
  reelTitle: { position:'absolute', bottom: 12, left: 12, right: 12, color: COLORS.text, fontSize: 16, fontWeight:'700' },

  tabs: { position:'absolute', left: SPACING, right: SPACING, bottom: 20, height: 68, backgroundColor: COLORS.card, borderRadius: 22, borderWidth:1, borderColor: COLORS.border, flexDirection:'row', justifyContent:'space-around', alignItems:'center', paddingHorizontal: 12 },
  tabItem: { alignItems:'center', justifyContent:'center', gap: 4, flex:1 },
  tabIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.wireframe },
  tabIconActive: { backgroundColor: COLORS.dark },
  tabLabel: { color: COLORS.sub, fontSize: 11 },
  tabLabelActive: { color: COLORS.text, fontWeight: '600' },
  fab: { width: 56, height: 56, borderRadius: 999, backgroundColor: COLORS.dark, alignItems:'center', justifyContent:'center', marginTop: -30 },
  fabIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.bg },
});

