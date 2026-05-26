package com.vietride.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.time.Duration;

@Service
public class AIService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public String generateReply(String userMessage) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("YOUR_GEMINI_API_KEY")) {
            return generateLocalFallbackReply(userMessage);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

            // Construct Gemini request body
            ObjectNode rootNode = mapper.createObjectNode();
            ArrayNode contentsNode = rootNode.putArray("contents");
            ObjectNode contentNode = contentsNode.addObject();
            
            // Set role to user
            contentNode.put("role", "user");
            ArrayNode partsNode = contentNode.putArray("parts");
            ObjectNode partNode = partsNode.addObject();
            
            String systemInstruction = "Bạn là trợ lý AI thông minh tích hợp trên VietRide X - Nền tảng đặt vé xe khách tương lai tại Việt Nam. "
                    + "Hãy trả lời câu hỏi của khách hàng bằng tiếng Việt, ngắn gọn, thân thiện, và hữu ích. "
                    + "Các tuyến phổ biến của chúng tôi gồm: TP.HCM đi Đà Lạt, Nha Trang, Đà Nẵng, Vũng Tàu; Hà Nội đi Sa Pa, Hải Phòng. "
                    + "Nhà xe đối tác gồm: Phương Trang (FUTA Bus Lines), Thành Bưởi Limousine, Sao Việt Premium, Hải Vân Express, Toàn Thắng Limousine. "
                    + "Câu hỏi khách hàng: ";

            partNode.put("text", systemInstruction + userMessage);

            String requestBody = mapper.writeValueAsString(rootNode);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode responseNode = mapper.readTree(response.body());
                JsonNode candidates = responseNode.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode parts = candidates.get(0).path("content").path("parts");
                    if (parts.isArray() && parts.size() > 0) {
                        return parts.get(0).path("text").asText().trim();
                    }
                }
            }
            
            // Log issue and fallback
            System.err.println("Gemini API call failed with status: " + response.statusCode() + ", body: " + response.body());
            return generateLocalFallbackReply(userMessage);
            
        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            return generateLocalFallbackReply(userMessage);
        }
    }

    private String generateLocalFallbackReply(String message) {
        String msg = message.toLowerCase();
        if (msg.contains("đà lạt") || msg.contains("da lat")) {
            return "Tuyến TP. Hồ Chí Minh đi Đà Lạt hiện có các chuyến khởi hành lúc 07:00 (Phương Trang, xe Sleeper 34, giá 300.000đ) và 22:00 (Thành Bưởi Limousine, xe Cabin 24, giá 420.000đ). Thời gian di chuyển khoảng 7 tiếng. Bạn có thể sử dụng khung tìm kiếm ở trên để đặt vé ngay!";
        }
        if (msg.contains("sa pa") || msg.contains("sapa")) {
            return "Tuyến Hà Nội đi Sa Pa dài 320km đi mất khoảng 6 tiếng. Chúng tôi có xe Sao Việt khởi hành lúc 06:30 (giá 320.000đ) và xe Hải Vân Express lúc 22:00 (giá 450.000đ). Trải nghiệm cabin riêng cực kỳ thoải mái và sang trọng!";
        }
        if (msg.contains("hải phòng") || msg.contains("hai phong")) {
            return "Tuyến Hà Nội đi Hải Phòng chạy đường cao tốc cực nhanh chỉ 2 tiếng. Có xe Hải Vân Express lúc 09:30 (220.000đ) và xe Toàn Thắng Limousine lúc 14:00 (160.000đ). Rất tiện lợi và đúng giờ!";
        }
        if (msg.contains("nha trang")) {
            return "Tuyến TP. Hồ Chí Minh đi Nha Trang khởi hành tối lúc 20:30 (Phương Trang, 350.000đ) và 21:30 (Thành Bưởi, 480.000đ), giúp bạn ngủ một giấc sáng mai là đến nơi để đi biển ngay.";
        }
        if (msg.contains("đà nẵng") || msg.contains("da nang")) {
            return "Tuyến TP. Hồ Chí Minh đi Đà Nẵng khởi hành lúc 08:00 (Phương Trang Sleeper, 450.000đ) và 17:30 (Thành Bưởi Cabin, 650.000đ). Thời gian di chuyển khoảng 18 tiếng.";
        }
        if (msg.contains("giá vé") || msg.contains("gia ve") || msg.contains("bao nhiêu") || msg.contains("bao nhieu") || msg.contains("tiền") || msg.contains("tien")) {
            return "Giá vé xe tại VietRide X dao động từ 160.000đ đến 650.000đ tùy theo cự ly và hạng xe (Ghế ngồi, Giường nằm Sleeper 34, hoặc Cabin Limousine cao cấp). Vui lòng nhập điểm đi/điểm đến ở bảng tìm kiếm để biết giá chính xác của từng chuyến.";
        }
        if (msg.contains("hủy") || msg.contains("huy") || msg.contains("đổi") || msg.contains("doi") || msg.contains("chính sách") || msg.contains("chinh sach")) {
            return "Chính sách hủy/đổi vé tại VietRide X:\n- Hủy trước giờ khởi hành > 24 giờ: Phí hủy là 10% giá vé.\n- Hủy trong vòng 24 giờ trước giờ khởi hành: Không hỗ trợ hoàn tiền.\nBạn vui lòng liên hệ hotline 1900-VIETRIDE để được hỗ trợ gấp.";
        }
        if (msg.contains("thanh toán") || msg.contains("thanh toan") || msg.contains("momo") || msg.contains("chuyển khoản") || msg.contains("chuyen khoan")) {
            return "Chúng tôi hỗ trợ nhiều phương thức thanh toán an toàn bao gồm: Ví điện tử MoMo, ZaloPay, Thẻ nội địa ATM và Chuyển khoản ngân hàng qua mã VietQR (giả lập thanh toán nhanh tức thì).";
        }
        return "Chào bạn! Tôi là trợ lý ảo VietRide AI. Tôi có thể giúp bạn tìm kiếm các chuyến xe (như Hồ Chí Minh đi Đà Lạt, Nha Trang, Đà Nẵng; Hà Nội đi Sa Pa, Hải Phòng), cung cấp giá vé, lịch trình và tư vấn chính sách đặt vé. Bạn muốn đi đâu thế?";
    }
}
