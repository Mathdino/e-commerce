import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import { useSignUp, useClerk } from "@clerk/expo";
import { COLORS } from "@/constants";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// ─── Força de senha ───────────────────────────────────────────────────────────
function getStrength(pwd: string): 0 | 1 | 2 | 3 {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

const STRENGTH_COLOR = { 1: "#EF4444", 2: "#F59E0B", 3: "#22C55E" } as const;
const STRENGTH_LABEL = { 1: "Fraca", 2: "Média", 3: "Forte" } as const;

function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = getStrength(password);
  const color = strength > 0 ? STRENGTH_COLOR[strength as 1 | 2 | 3] : "#E5E7EB";
  const label = strength > 0 ? STRENGTH_LABEL[strength as 1 | 2 | 3] : "";

  const p1 = useSharedValue(0);
  const p2 = useSharedValue(0);
  const p3 = useSharedValue(0);

  useEffect(() => {
    p1.value = withTiming(strength >= 1 ? 1 : 0, { duration: 350 });
    p2.value = withTiming(strength >= 2 ? 1 : 0, { duration: 350 });
    p3.value = withTiming(strength >= 3 ? 1 : 0, { duration: 350 });
  }, [strength]);

  const s1 = useAnimatedStyle(() => ({ opacity: p1.value, backgroundColor: color }));
  const s2 = useAnimatedStyle(() => ({ opacity: p2.value, backgroundColor: color }));
  const s3 = useAnimatedStyle(() => ({ opacity: p3.value, backgroundColor: color }));

  if (!password) return null;

  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {([s1, s2, s3] as const).map((anim, i) => (
          <View key={i} style={styles.barTrack}>
            <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: 2 }, anim]} />
          </View>
        ))}
      </View>
      {label ? (
        <Text style={{ color, fontSize: 12, marginTop: 4, fontWeight: "600" }}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function SignUpScreen() {
  // @clerk/expo v3: useSignUp retorna { signUp, ... } e setActive vem de useClerk()
  const { signUp } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Cadastro ─────────────────────────────────────────────────────────────
  const onSignUpPress = async () => {
    if (!signUp) {
      Alert.alert("Erro", "Serviço indisponível. Tente novamente.");
      return;
    }
    if (!firstName.trim() || !emailAddress.trim() || !password.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha nome, e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      // 1. Cria o usuário
      const signUpResult = await signUp.create({
        emailAddress: emailAddress.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // No Clerk v3 (Future API) o resultado fica em signUpResult.data;
      // o proxy reativo (signUp) pode não atualizar de forma confiável no native.
      const signUpData = (signUpResult as any)?.data ?? signUp;

      console.log("[SignUp] status:", signUpData.status);
      console.log("[SignUp] unverifiedFields:", JSON.stringify(signUpData.unverifiedFields));
      console.log("[SignUp] createdSessionId:", signUpData.createdSessionId);

      // 2a. Cadastro já completo (verificação de e-mail desabilitada)
      if (signUpData.status === "complete") {
        await setActive({ session: signUpData.createdSessionId });
        router.replace("/");
        return;
      }

      // 2b. Precisa verificar e-mail
      // @clerk/expo v3: usa verifications.emailAddress.sendEmailCode()
      if (signUpData.unverifiedFields?.includes("email_address")) {
        await signUp.verifications.sendEmailCode();
        setPendingVerification(true);
        Alert.alert("Código enviado!", `Verifique: ${emailAddress.trim()}`);
        return;
      }

      Alert.alert(
        "Atenção",
        `Status: "${signUpData.status}"\nCampos: ${JSON.stringify(signUpData.unverifiedFields)}`
      );
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        err?.message ??
        "Algo deu errado.";
      console.error("[SignUp] Erro:", JSON.stringify(err, null, 2));
      Alert.alert("Falha no cadastro", msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Verificação do código ─────────────────────────────────────────────────
  const onVerifyPress = async () => {
    if (!signUp || !code.trim()) {
      Alert.alert("Código obrigatório", "Digite o código recebido por e-mail.");
      return;
    }

    setLoading(true);
    try {
      // @clerk/expo v3: usa verifications.emailAddress.verifyEmailCode()
      const verifyResult = await signUp.verifications.verifyEmailCode({ code: code.trim() });

      // Prefere result.data para compatibilidade com o native
      const verifyData = (verifyResult as any)?.data ?? signUp;

      console.log("[SignUp] Após verificação - status:", verifyData.status);

      if (verifyData.status === "complete") {
        await setActive({ session: verifyData.createdSessionId });
        router.replace("/");
      } else {
        Alert.alert("Verificação incompleta", `Status: ${signUp.status}`);
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        "Código inválido ou expirado.";
      console.error("[SignUp] Erro verificação:", JSON.stringify(err, null, 2));
      Alert.alert("Falha na verificação", msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Reenviar código ───────────────────────────────────────────────────────
  const onResendCode = async () => {
    if (!signUp) return;
    try {
      await signUp.verifications.sendEmailCode();
      Alert.alert("Código reenviado!", "Verifique sua caixa de entrada.");
    } catch (err: any) {
      Alert.alert("Erro", err?.errors?.[0]?.message ?? "Não foi possível reenviar.");
    }
  };

  // ─── UI ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 28, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.push("/")}
            style={{ marginBottom: 32, alignSelf: "flex-start" }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {!pendingVerification ? (
            <>
              <View style={{ alignItems: "center", marginBottom: 32 }}>
                <Text style={styles.title}>Criar Conta</Text>
                <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="João"
                  placeholderTextColor="#999"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Sobrenome</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Silva"
                  placeholderTextColor="#999"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.label}>E-mail *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="usuario@exemplo.com"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                />
              </View>

              <View style={{ marginBottom: 28 }}>
                <Text style={styles.label}>Senha *</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, borderWidth: 0, borderRadius: 0 }]}
                    placeholder="Mínimo 8 caracteres"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={COLORS.secondary}
                    />
                  </TouchableOpacity>
                </View>
                <PasswordStrengthMeter password={password} />
              </View>

              <TouchableOpacity
                style={[styles.btn, { opacity: loading ? 0.7 : 1 }]}
                onPress={onSignUpPress}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Continuar</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={{ color: COLORS.secondary }}>Já tem uma conta? </Text>
                <Link href="/sign-in">
                  <Text style={{ color: COLORS.primary, fontWeight: "700" }}>Entrar</Text>
                </Link>
              </View>
            </>
          ) : (
            <>
              <View style={{ alignItems: "center", marginBottom: 32 }}>
                <View style={styles.iconCircle}>
                  <Ionicons name="mail-outline" size={32} color={COLORS.primary} />
                </View>
                <Text style={[styles.title, { marginTop: 16 }]}>Verificar E-mail</Text>
                <Text style={[styles.subtitle, { textAlign: "center" }]}>
                  Código enviado para{"\n"}
                  <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                    {emailAddress}
                  </Text>
                </Text>
              </View>

              <View style={{ marginBottom: 24 }}>
                <Text style={styles.label}>Código de verificação</Text>
                <TextInput
                  style={[styles.input, { textAlign: "center", fontSize: 22, letterSpacing: 8, fontWeight: "700" }]}
                  placeholder="000000"
                  placeholderTextColor="#ccc"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={code}
                  onChangeText={setCode}
                />
              </View>

              <TouchableOpacity
                style={[styles.btn, { opacity: loading ? 0.7 : 1 }]}
                onPress={onVerifyPress}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Verificar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={onResendCode} style={{ alignItems: "center", marginTop: 20 }}>
                <Text style={{ color: COLORS.secondary }}>
                  Não recebeu?{" "}
                  <Text style={{ color: COLORS.primary, fontWeight: "700" }}>Reenviar código</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: COLORS.primary, marginBottom: 6 },
  subtitle: { color: COLORS.secondary, lineHeight: 20 },
  fieldWrap: { marginBottom: 16 },
  label: { color: COLORS.primary, fontWeight: "600", marginBottom: 6, fontSize: 14 },
  input: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    color: COLORS.primary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  eyeBtn: { paddingHorizontal: 14, paddingVertical: 14 },
  btn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 50, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.surface, justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },
  barTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", overflow: "hidden" },
});
