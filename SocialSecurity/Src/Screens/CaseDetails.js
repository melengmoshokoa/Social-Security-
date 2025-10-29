import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking, TouchableOpacity } from "react-native";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://afvyzztqauaklbwzhdsd.supabase.co"; const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdnl6enRxYXVha2xid3poZHNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTg2ODkwOCwiZXhwIjoyMDcxNDQ0OTA4fQ.71gljYoXlwXV3QU_Pfkxq-3RuZzShpe7FVLPKYcm9tg";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function CaseDetails({ route }) {
  const { report } = route.params;
  const [pdfFiles, setPdfFiles] = useState([]);
  const [logFiles, setLogFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- Fetch PDFs ---
        const { data: pdfData, error: pdfError } = await supabase
          .storage
          .from("reports-pdfs")
          .list(report.user_id);

        if (pdfError) throw pdfError;

        const pdfFilesWithHash = pdfData.map(file => {
          const url = supabase
            .storage
            .from("reports-pdfs")
            .getPublicUrl(`${report.user_id}/${file.name}`).data.publicUrl;

          // Use hash from report object
          const hash = report.pdf_hash || "N/A";

          return { name: file.name, url, hash };
        });

        setPdfFiles(pdfFilesWithHash);

        // --- Fetch zip_logs for this user ---
        const { data: zipLogs, error: logsError } = await supabase
          .from("zip_logs")
          .select("*")
          .eq("user_id", report.user_id)
          .order("created_at", { ascending: false });

        if (logsError) throw logsError;

        // Prepare log files list from zip_logs table and generate public URLs
        const logsWithUrls = [];
        if (zipLogs && zipLogs.length > 0) {
          const latestLog = zipLogs[0]; 
          const bucket = "user-logs";

          if (latestLog.login_csv_hash) {
            logsWithUrls.push({
              name: "login_activity.csv",
              url: supabase.storage.from(bucket).getPublicUrl(`${report.user_id}/login_activity.csv`).data.publicUrl,
              hash: latestLog.login_csv_hash
            });
          }
          if (latestLog.messages_csv_hash) {
            logsWithUrls.push({
              name: "messages.csv",
              url: supabase.storage.from(bucket).getPublicUrl(`${report.user_id}/messages.csv`).data.publicUrl,
              hash: latestLog.messages_csv_hash
            });
          }
          if (latestLog.posts_csv_hash) {
            logsWithUrls.push({
              name: "posts.csv",
              url: supabase.storage.from(bucket).getPublicUrl(`${report.user_id}/posts.csv`).data.publicUrl,
              hash: latestLog.posts_csv_hash
            });
          }
        }

        setLogFiles(logsWithUrls);

      } catch (err) {
        console.error("Error fetching evidence/logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <ScrollView style={style.container}>
      <Text style={style.title}>{report.report_title}</Text>
      <Text style={style.date}>{new Date(report.created_at).toLocaleString()}</Text>
      <Text style={style.details}>{report.report_details}</Text>

      <Text style={style.sectionTitle}>Evidence PDFs</Text>
      {pdfFiles.length > 0 ? (
        pdfFiles.map((file, index) => (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(file.url)}>
            <Text style={style.link}>📎 {file.name}</Text>
            <Text style={style.hash}>Hash: {file.hash}</Text>
          </TouchableOpacity>
        ))
      ) : <Text>No PDF evidence found.</Text>}

      <Text style={style.sectionTitle}>User Logs (CSV)</Text>
      {logFiles.length > 0 ? (
        logFiles.map((file, index) => (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(file.url)}>
            <Text style={style.link}>📄 {file.name}</Text>
            <Text style={style.hash}>Hash: {file.hash}</Text>
          </TouchableOpacity>
        ))
      ) : <Text>No logs found.</Text>}

    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, paddingTop: 70, backgroundColor: "#FFF7E9", paddingHorizontal: 20 },
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 5 },
  date: { color: "#999", marginBottom: 15 },
  details: { fontSize: 16, lineHeight: 22, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  link: { color: "#007BFF", marginBottom: 2, textDecorationLine: "underline", fontSize: 16 },
  hash: { color: "#555", marginBottom: 10, fontSize: 14 },
});
