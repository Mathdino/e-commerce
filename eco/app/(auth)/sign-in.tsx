import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useSignIn, useClerk } from "@clerk/expo";
import { COLORS } from "@/constants";

export default function SignInScreen() {
  // @clerk/expo v3: useSignIn retorna { signIn, ... } e setActive vem de useClerk()
  const { signIn } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!signIn) {
      Alert.alert("Erro", "Serviço indisponível. Tente novamente.");
      return;
    }
    if (!emailAddress.trim() || !password.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      // No @clerk/expo v3, signIn.status no proxy é estático ("needs_identifier").
      // O status real vem do RETORNO de create().
      const result = await signIn.create({
        identifier: emailAddress.trim().toLowerCase(),
        password,
      });

      console.log("[SignIn] result.status:", result?.status);
      console.log("[SignIn] result.createdSessionId:", result?.createdSessionId);

      if (result?.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      } else {
        Alert.alert(
          "Login incompleto",
          `Status: "${result?.status}"\n\nVerifique as configurações no Clerk Dashboard.`
        );
      }
    } catch (err: any) {
      const code = err?.errors?.[0]?.code ?? "";
      const msg = translateClerkCode(code) || (err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message ?? "Algo deu errado.");
      console.error("[SignIn] Erro:", JSON.stringify(err, null, 2));
      Alert.alert("Falha no login", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 28, paddingBottom: 60, flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.push("/")}
            style={{ marginBottom: 32, alignSelf: "flex-start" }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <View style={{ alignItems: "center", marginBottom: 36 }}>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="usuario@exemplo.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={emailAddress}
              onChangeText={setEmailAddress}
              returnKeyType="next"
            />
          </View>

          <View style={{ marginBottom: 28 }}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0, borderRadius: 0 }]}
                placeholder="Sua senha"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={onSignInPress}
                returnKeyType="done"
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
          </View>

          <TouchableOpacity
            style={[styles.btn, { opacity: loading || !emailAddress || !password ? 0.5 : 1 }]}
            onPress={onSignInPress}
            disabled={loading || !emailAddress || !password}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={{ color: COLORS.secondary }}>Não tem uma conta? </Text>
            <Link href="/sign-up">
              <Text style={{ color: COLORS.primary, fontWeight: "700" }}>Cadastre-se</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function translateClerkCode(code: string): string {
  const map: Record<string, string> = {
    form_password_incorrect: "Senha incorreta.",
    form_identifier_not_found: "E-mail não encontrado. Verifique ou cadastre-se.",
    form_param_format_invalid: "E-mail inválido.",
    too_many_requests: "Muitas tentativas. Aguarde alguns minutos.",
    strategy_for_user_invalid: "Método de login inválido para este e-mail.",
    session_exists: "Você já está logado.",
  };
  return map[code] ?? "";
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: COLORS.primary, marginBottom: 6 },
  subtitle: { color: COLORS.secondary },
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
});
