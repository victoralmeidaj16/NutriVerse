import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

const WeekDayCard: React.FC<{ day: string; date: string; meals: any[]; isToday?: boolean }> = ({ day, date, meals, isToday }) => (
  <View style={[styles.dayCard, isToday && styles.dayCardToday]}>
    <View style={styles.dayCardHeader}>
      <View>
        <Text style={styles.dayName}>{day}</Text>
        <Text style={styles.dayDate}>{date}</Text>
      </View>
      {isToday && (
        <View style={styles.todayBadge}>
          <Text style={styles.todayBadgeText}>Hoje</Text>
        </View>
      )}
    </View>
    {meals.map((meal, idx) => (
      <TouchableOpacity key={idx} style={styles.mealItem}>
        <View style={styles.mealIconContainer}>
          <Ionicons name={meal.icon as any} size={20} color={COLORS.lime} />
        </View>
        <View style={styles.mealContent}>
          <Text style={styles.mealTitle}>{meal.title}</Text>
          <Text style={styles.mealSub}>{meal.macros}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.sub} />
      </TouchableOpacity>
    ))}
    <TouchableOpacity style={styles.addMealBtn}>
      <Ionicons name="add-circle-outline" size={20} color={COLORS.orbit} />
      <Text style={styles.addMealText}>Adicionar refeição</Text>
    </TouchableOpacity>
  </View>
);

const ShoppingListItem: React.FC<{ item: string; quantity?: string; checked: boolean; onToggle: () => void }> = ({ item, quantity, checked, onToggle }) => (
  <TouchableOpacity style={styles.shoppingItem} onPress={onToggle} activeOpacity={0.7}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Ionicons name="checkmark" size={16} color={COLORS.bg} />}
    </View>
    <Text style={[styles.shoppingItemText, checked && styles.shoppingItemTextChecked]}>
      {item} {quantity && `• ${quantity}`}
    </Text>
  </TouchableOpacity>
);

const WeekStatsCard: React.FC = () => (
  <LinearGradient colors={[COLORS.lime + '15', COLORS.orbit + '15']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.statsCard}>
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <MaterialCommunityIcons name="target" size={24} color={COLORS.lime} />
        <Text style={styles.statValue}>1.820 kcal</Text>
        <Text style={styles.statLabel}>Meta diária</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <MaterialCommunityIcons name="food-apple" size={24} color={COLORS.orbit} />
        <Text style={styles.statValue}>145g</Text>
        <Text style={styles.statLabel}>Proteína</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <MaterialCommunityIcons name="calendar-week" size={24} color={COLORS.text} />
        <Text style={styles.statValue}>7/7</Text>
        <Text style={styles.statLabel}>Dias</Text>
      </View>
    </View>
  </LinearGradient>
);

// ————— DATA (mock) —————
const WEEK_MEALS = [
  {
    day: 'Seg',
    date: '09',
    isToday: true,
    meals: [
      { icon: 'sunny-outline', title: 'Aveia com frutas', macros: '420 kcal • 28g P' },
      { icon: 'restaurant-outline', title: 'Salada de frango', macros: '550 kcal • 42g P' },
      { icon: 'moon-outline', title: 'Salmão grelhado', macros: '480 kcal • 38g P' },
    ]
  },
  {
    day: 'Ter',
    date: '10',
    meals: [
      { icon: 'sunny-outline', title: 'Omelete proteico', macros: '380 kcal • 32g P' },
      { icon: 'restaurant-outline', title: 'Bowl de quinoa', macros: '520 kcal • 35g P' },
      { icon: 'moon-outline', title: 'Peito de peru', macros: '450 kcal • 40g P' },
    ]
  },
  {
    day: 'Qua',
    date: '11',
    meals: [
      { icon: 'sunny-outline', title: 'Smoothie verde', macros: '350 kcal • 20g P' },
      { icon: 'restaurant-outline', title: 'Atum com batata', macros: '480 kcal • 38g P' },
    ]
  },
  {
    day: 'Qui',
    date: '12',
    meals: [
      { icon: 'sunny-outline', title: 'Panqueca proteica', macros: '400 kcal • 30g P' },
      { icon: 'restaurant-outline', title: 'Frango ao curry', macros: '560 kcal • 45g P' },
      { icon: 'moon-outline', title: 'Legumes grelhados', macros: '320 kcal • 15g P' },
    ]
  },
  {
    day: 'Sex',
    date: '13',
    meals: [
      { icon: 'sunny-outline', title: 'Granola com iogurte', macros: '390 kcal • 25g P' },
      { icon: 'restaurant-outline', title: 'Pasta de grão-de-bico', macros: '500 kcal • 30g P' },
    ]
  },
];

const SHOPPING_LIST = [
  { item: 'Peito de frango', quantity: '1kg', checked: false },
  { item: 'Salmão', quantity: '500g', checked: true },
  { item: 'Quinoa', quantity: '500g', checked: false },
  { item: 'Aveia', quantity: '1kg', checked: true },
  { item: 'Banana', quantity: '10 un', checked: false },
  { item: 'Espinafre', quantity: '500g', checked: false },
  { item: 'Ovos', quantity: '12 un', checked: true },
  { item: 'Iogurte grego', quantity: '1kg', checked: false },
];

// ————— SCREEN —————
const PlanScreen: React.FC<{ navigate: (screen: string) => void }> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [shoppingList, setShoppingList] = useState(SHOPPING_LIST);

  const toggleShoppingItem = (index: number) => {
    const newList = [...shoppingList];
    newList[index].checked = !newList[index].checked;
    setShoppingList(newList);
  };

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    if (index === 0) {
      navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hi}>Planejamento semanal</Text>
            <Text style={styles.subtitle}>6–12 de Novembro</Text>
          </View>
          <View style={{ flexDirection:'row', gap: 14 }}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="download-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="share-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Week Stats */}
        <WeekStatsCard />

        {/* Quick Actions */}
        <View style={{ flexDirection:'row', gap: 12, paddingHorizontal: SPACING, marginTop: 20 }}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="sparkles-outline" size={20} color={COLORS.lime} />
            <Text style={styles.quickActionText}>Preencher IA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <MaterialCommunityIcons name="food-off-outline" size={20} color={COLORS.orbit} />
            <Text style={styles.quickActionText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="repeat-outline" size={20} color={COLORS.text} />
            <Text style={styles.quickActionText}>Duplicar</Text>
          </TouchableOpacity>
        </View>

        {/* Week Meals */}
        <View style={{ paddingHorizontal: SPACING, marginTop: 24 }}>
          {WEEK_MEALS.map((day, idx) => (
            <WeekDayCard key={idx} {...day} />
          ))}
        </View>

        {/* Shopping List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection:'row', alignItems:'center', gap: 8 }}>
              <MaterialCommunityIcons name="cart-outline" size={24} color={COLORS.lime} />
              <Text style={styles.sectionTitle}>Lista de compras</Text>
            </View>
            <Text style={styles.sectionCTA}>
              {shoppingList.filter(i => !i.checked).length} itens
            </Text>
          </View>
          
          <View style={styles.shoppingList}>
            {shoppingList.map((item, idx) => (
              <ShoppingListItem key={idx} {...item} onToggle={() => toggleShoppingItem(idx)} />
            ))}
          </View>

          <TouchableOpacity style={styles.exportBtn}>
            <Ionicons name="share-social-outline" size={18} color={COLORS.text} />
            <Text style={styles.exportBtnText}>Exportar lista</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Tabs */}
      <BottomTabs activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default PlanScreen;

// ————— STYLES —————
const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor: COLORS.bg },
  container: { flex:1 },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal: SPACING, paddingTop: 6, paddingBottom: 12 },
  hi: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: COLORS.sub, marginTop: 4 },
  headerIcon: { width:42, height:42, borderRadius:12, borderWidth:1, borderColor: COLORS.border, alignItems:'center', justifyContent:'center', backgroundColor: COLORS.card },

  statsCard: { marginHorizontal: SPACING, borderRadius: 20, padding: 16, borderWidth:1, borderColor: COLORS.border, marginTop: 12 },
  statsRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-around' },
  statItem: { alignItems:'center', gap: 4 },
  statValue: { color: COLORS.text, fontSize: 18, fontWeight:'800' },
  statLabel: { color: COLORS.sub, fontSize: 12 },
  statDivider: { width:1, height:40, backgroundColor: COLORS.border },

  quickAction: { flex:1, backgroundColor: COLORS.card, paddingVertical: 12, borderRadius: 12, borderWidth:1, borderColor: COLORS.border, flexDirection:'row', alignItems:'center', justifyContent:'center', gap: 6 },
  quickActionText: { color: COLORS.text, fontWeight:'600', fontSize: 13 },

  dayCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth:1, borderColor: COLORS.border },
  dayCardToday: { borderColor: COLORS.lime, borderWidth:2 },
  dayCardHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 12 },
  dayName: { color: COLORS.text, fontSize: 16, fontWeight:'700' },
  dayDate: { color: COLORS.sub, fontSize: 13, marginTop: 2 },
  todayBadge: { backgroundColor: COLORS.lime, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  todayBadgeText: { color: COLORS.bg, fontWeight:'800', fontSize: 11 },

  mealItem: { flexDirection:'row', alignItems:'center', paddingVertical: 12, borderBottomWidth:1, borderBottomColor: COLORS.border },
  mealIconContainer: { width:36, height:36, borderRadius:8, backgroundColor: COLORS.lime + '20', alignItems:'center', justifyContent:'center', marginRight: 12 },
  mealContent: { flex:1 },
  mealTitle: { color: COLORS.text, fontSize: 15, fontWeight:'600' },
  mealSub: { color: COLORS.sub, fontSize: 13, marginTop: 2 },
  
  addMealBtn: { flexDirection:'row', alignItems:'center', justifyContent:'center', marginTop: 8, paddingVertical: 10, gap: 6 },
  addMealText: { color: COLORS.orbit, fontWeight:'600', fontSize: 14 },

  section: { paddingHorizontal: SPACING, marginTop: 24 },
  sectionHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight:'700' },
  sectionCTA: { color: COLORS.sub, fontSize: 14 },

  shoppingList: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth:1, borderColor: COLORS.border, overflow:'hidden' },
  shoppingItem: { flexDirection:'row', alignItems:'center', padding: 16, borderBottomWidth:1, borderBottomColor: COLORS.border },
  checkbox: { width:24, height:24, borderRadius:6, borderWidth:2, borderColor: COLORS.sub, alignItems:'center', justifyContent:'center', marginRight: 12 },
  checkboxChecked: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  shoppingItemText: { flex:1, color: COLORS.text, fontSize: 15, fontWeight:'500' },
  shoppingItemTextChecked: { textDecorationLine:'line-through', color: COLORS.sub },

  exportBtn: { marginTop: 16, backgroundColor: COLORS.card, paddingVertical: 14, borderRadius: 12, borderWidth:1, borderColor: COLORS.border, flexDirection:'row', alignItems:'center', justifyContent:'center', gap: 8 },
  exportBtnText: { color: COLORS.text, fontWeight:'700', fontSize: 15 },

  tabs: { position:'absolute', left: SPACING, right: SPACING, bottom: 20, height: 68, backgroundColor: 'rgba(22,22,27,0.92)', borderRadius: 22, borderWidth:1, borderColor: COLORS.border, flexDirection:'row', justifyContent:'space-around', alignItems:'center', paddingHorizontal: 12 },
  tabItem: { alignItems:'center', justifyContent:'center', gap: 4, flex:1 },
  tabLabel: { color: COLORS.sub, fontSize: 11 },
  fab: { width: 56, height: 56, borderRadius: 999, backgroundColor: COLORS.lime, alignItems:'center', justifyContent:'center', marginTop: -30, shadowColor:'#000', shadowOpacity:0.3, shadowOffset:{ width:0, height:10 }, shadowRadius:16, elevation:8 },
});

