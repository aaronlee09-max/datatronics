import SwiftUI
import WebKit

@main
struct FontoryApp: App {
    var body: some Scene {
        WindowGroup {
            FontoryHomeView()
                .preferredColorScheme(nil)
        }
    }
}

struct FontoryHomeView: View {
    @State private var selectedSite = FontorySite.desktop
    @State private var reloadID = UUID()

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                Picker("사이트", selection: $selectedSite) {
                    ForEach(FontorySite.allCases) { site in
                        Text(site.title).tag(site)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)
                .padding(.vertical, 10)

                WebView(url: selectedSite.url, reloadID: reloadID)
                    .id(selectedSite)
                    .ignoresSafeArea(edges: .bottom)
            }
            .navigationTitle("Fontory")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        reloadID = UUID()
                    } label: {
                        Image(systemName: "arrow.clockwise")
                    }
                    .accessibilityLabel("새로고침")
                }
            }
        }
    }
}

enum FontorySite: String, CaseIterable, Identifiable {
    case desktop
    case mobile

    var id: String { rawValue }

    var title: String {
        switch self {
        case .desktop: return "Fontory"
        case .mobile: return "Fontory 모바일"
        }
    }

    var url: URL {
        switch self {
        case .desktop: return URL(string: "https://softronics.run.place/")!
        case .mobile: return URL(string: "https://m.softronics.run.place/")!
        }
    }
}

struct WebView: UIViewRepresentable {
    let url: URL
    let reloadID: UUID

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        let view = WKWebView(frame: .zero, configuration: configuration)
        view.allowsBackForwardNavigationGestures = true
        view.scrollView.contentInsetAdjustmentBehavior = .never
        view.load(URLRequest(url: url))
        return view
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        if context.coordinator.lastReloadID != reloadID {
            context.coordinator.lastReloadID = reloadID
            webView.load(URLRequest(url: url))
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(reloadID: reloadID)
    }

    final class Coordinator {
        var lastReloadID: UUID
        init(reloadID: UUID) { self.lastReloadID = reloadID }
    }
}
