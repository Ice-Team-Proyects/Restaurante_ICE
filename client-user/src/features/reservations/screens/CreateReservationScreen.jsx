// c:/neww/Restaurante_ICE/client-user/src/features/reservations/screens/CreateReservationScreen.jsx
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useReservations } from "../hooks/useReservations.js";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Card, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const TIME_SLOTS = [
  "12:00", "13:00", "14:00", "15:00",
  "18:00", "19:00", "20:00", "21:00", "22:00"
];

export default function CreateReservationScreen({ route, navigation }) {
  const { fieldId, fieldName } = route.params || {};
  const { createReservation, fetchAvailableTables, loading, error: resError } = useReservations();

  // Load available tables
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);

  // Date and Time picker state
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [selectedTime, setSelectedTime] = useState("19:00");
  const [peopleCount, setPeopleCount] = useState(2);

  useEffect(() => {
    // Tomorrow as default date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    setSelectedDateStr(tomorrowStr);
  }, []);

  useEffect(() => {
    if (fieldId) {
      setLoadingTables(true);
      fetchAvailableTables(fieldId).then((fetched) => {
        setTables(fetched);
        if (fetched.length > 0) {
          setSelectedTable(fetched[0]);
          // Default people count to table capacity or 2
          setPeopleCount(Math.min(2, fetched[0].capacity));
        }
        setLoadingTables(false);
      });
    }
  }, [fieldId, fetchAvailableTables]);

  // Handle table select
  const handleSelectTable = (table) => {
    setSelectedTable(table);
    if (peopleCount > table.capacity) {
      setPeopleCount(table.capacity);
    }
  };

  // Stepper handlers
  const incrementPeople = () => {
    const maxCapacity = selectedTable ? selectedTable.capacity : 12;
    if (peopleCount < maxCapacity) {
      setPeopleCount(peopleCount + 1);
    }
  };

  const decrementPeople = () => {
    if (peopleCount > 1) {
      setPeopleCount(peopleCount - 1);
    }
  };

  // Calendar Helpers
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const handleMonthChange = (direction) => {
    const nextDate = new Date(currentMonthDate);
    nextDate.setMonth(nextDate.getMonth() + direction);
    
    // Prevent navigating before today's month
    const today = new Date();
    today.setDate(1);
    today.setHours(0,0,0,0);
    if (nextDate >= today || direction === 1) {
      setCurrentMonthDate(nextDate);
    }
  };

  // Generate days array
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);
  
  const calendarDays = [];
  // Preceding blank spaces
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ key: `blank-${i}`, isBlank: true });
  }
  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    
    // Check if day is in the past
    const todayObj = new Date();
    todayObj.setHours(0,0,0,0);
    const cellDateObj = new Date(year, month, i);
    const isPast = cellDateObj < todayObj;

    calendarDays.push({
      key: `day-${i}`,
      dayNum: i,
      dateStr,
      isPast
    });
  }

  const handleSubmitReservation = async () => {
    if (!selectedTable) {
      Alert.alert("Selección requerida", "Por favor selecciona una mesa disponible.");
      return;
    }
    if (!selectedDateStr) {
      Alert.alert("Selección requerida", "Por favor selecciona una fecha de la reserva.");
      return;
    }

    const payload = {
      date: selectedDateStr,
      time: selectedTime,
      people: peopleCount,
      tableId: selectedTable._id,
      restaurantId: fieldId
    };

    const res = await createReservation(payload);
    if (res.success) {
      Alert.alert(
        "Reserva Exitosa",
        `Mesa #${selectedTable.number} reservada para el ${selectedDateStr} a las ${selectedTime} hrs.`,
        [
          {
            text: "Ir a Mis Reservas",
            onPress: () => navigation.navigate("ReservationsList")
          }
        ]
      );
    } else {
      Alert.alert("Error de Reservación", res.error);
    }
  };

  // Clean restaurant title
  const cleanBranchName = fieldName ? fieldName.replace("Mesa en ", "") : "Sucursal";

  return (
    <GlassBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Sucursal Title Card */}
        <Card style={styles.sucursalCard}>
          <View style={styles.sucursalInfoRow}>
            <MaterialIcons name="storefront" size={24} color={COLORS.primary} />
            <Text style={styles.sucursalTitle}>{cleanBranchName}</Text>
          </View>
          <Text style={styles.sucursalSubtitle}>Reservando mesa en esta sucursal</Text>
        </Card>

        {resError ? <Text style={styles.errorText}>{resError}</Text> : null}

        {/* 1. SELECCIONAR MESA */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Selecciona tu Mesa</Text>
          {loadingTables ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ margin: SPACING.md }} />
          ) : tables.length === 0 ? (
            <Text style={styles.noTablesText}>No hay mesas disponibles en esta sucursal.</Text>
          ) : (
            <View style={styles.tableGrid}>
              {tables.map((t) => {
                const isSelected = selectedTable?._id === t._id;
                return (
                  <TouchableOpacity
                    key={t._id}
                    style={[styles.tableItem, isSelected && styles.tableItemActive]}
                    onPress={() => handleSelectTable(t)}
                  >
                    <MaterialIcons 
                      name="table-restaurant" 
                      size={20} 
                      color={isSelected ? "#FFF" : COLORS.primary} 
                    />
                    <Text style={[styles.tableNumber, isSelected && styles.textWhite]}>
                      Mesa #{t.number}
                    </Text>
                    <Text style={[styles.tableCapacity, isSelected && styles.textWhite]}>
                      Cap: {t.capacity} pers
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Card>

        {/* 2. SELECCIONAR FECHA (CALENDARIO) */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Selecciona la Fecha</Text>
          <View style={styles.calendarContainer}>
            {/* Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                <MaterialIcons name="chevron-left" size={26} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.calendarMonthName}>
                {MONTH_NAMES[month]} {year}
              </Text>
              <TouchableOpacity onPress={() => handleMonthChange(1)}>
                <MaterialIcons name="chevron-right" size={26} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Weekdays Row */}
            <View style={styles.weekdaysRow}>
              {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((w, idx) => (
                <Text key={idx} style={styles.weekdayText}>{w}</Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.daysGrid}>
              {calendarDays.map((cell, idx) => {
                if (cell.isBlank) {
                  return <View key={cell.key} style={styles.dayCellEmpty} />;
                }
                const isSelected = selectedDateStr === cell.dateStr;
                const isPast = cell.isPast;

                return (
                  <TouchableOpacity
                    key={cell.key}
                    disabled={isPast}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellActive,
                      isPast && styles.dayCellPast
                    ]}
                    onPress={() => setSelectedDateStr(cell.dateStr)}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected && styles.textWhite,
                      isPast && styles.dayTextPast
                    ]}>
                      {cell.dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Card>

        {/* 3. SELECCIONAR HORARIO */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Selecciona el Horario</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((t) => {
              const isSelected = selectedTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeSlot, isSelected && styles.timeSlotActive]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text style={[styles.timeSlotText, isSelected && styles.textWhite]}>
                    {t} hrs
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* 4. CANTIDAD DE PERSONAS */}
        <Card style={[styles.sectionCard, styles.stepperCard]}>
          <View style={styles.stepperInfo}>
            <Text style={styles.sectionTitle}>4. Cantidad de Personas</Text>
            {selectedTable && (
              <Text style={styles.capacityLimitText}>
                *Límite de esta mesa: {selectedTable.capacity} personas
              </Text>
            )}
          </View>
          <View style={styles.stepperContainer}>
            <TouchableOpacity style={styles.stepperBtn} onPress={decrementPeople}>
              <MaterialIcons name="remove" size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.stepperVal}>{peopleCount}</Text>
            <TouchableOpacity style={styles.stepperBtn} onPress={incrementPeople}>
              <MaterialIcons name="add" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        <Button
          title="Confirmar Reservación"
          type="primary"
          loading={loading}
          onPress={handleSubmitReservation}
          style={styles.submitBtn}
        />

      </ScrollView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  sucursalCard: {
    borderRadius: 16,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  sucursalInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  sucursalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
  },
  sucursalSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginLeft: 32,
  },
  sectionCard: {
    borderRadius: 18,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  noTablesText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    textAlign: "center",
    padding: SPACING.sm,
  },
  tableGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  tableItem: {
    width: "48%",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    gap: 4,
  },
  tableItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  tableNumber: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.text,
  },
  tableCapacity: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  calendarContainer: {
    width: "100%",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  calendarMonthName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
  },
  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  weekdayText: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1.1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  dayCellEmpty: {
    width: "14.28%",
    aspectRatio: 1.1,
  },
  dayCellActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  dayCellPast: {
    opacity: 0.35,
  },
  dayText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.text,
  },
  dayTextPast: {
    color: COLORS.textLight,
    textDecorationLine: "line-through",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  timeSlot: {
    width: "31%",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  timeSlotActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  stepperCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  stepperInfo: {
    flex: 1,
  },
  capacityLimitText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepperBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  stepperVal: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
    marginHorizontal: SPACING.md,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  textWhite: {
    color: "#FFF",
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    backgroundColor: "#FEE2E2",
    padding: SPACING.sm,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
});
