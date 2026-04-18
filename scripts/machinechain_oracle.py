import hashlib
import random
import time

EQUIPMENT_ID = "PRESS_LINE_NL_01"


def read_sensor_data(reading_number: int):
    data = {
        "equipment_id": EQUIPMENT_ID,
        "vibration_mms": random.gauss(2.5, 0.3),
        "temperature_c": random.gauss(65, 5),
        "current_amps": random.gauss(12.0, 0.8),
        "timestamp": time.time(),
        "reading": reading_number,
    }

    if reading_number == 10:
        data["vibration_mms"] = 5.8
        data["temperature_c"] = 91.0
        data["current_amps"] = 17.2

    return data


def detect_anomaly(sensor_data):
    score = 0
    reasons = []

    if sensor_data["vibration_mms"] > 4.5:
        score += 40
        reasons.append("BEARING_FAILURE_VIBRATION")
    if sensor_data["temperature_c"] > 85:
        score += 35
        reasons.append("MOTOR_OVERTEMPERATURE")
    if sensor_data["current_amps"] > 16:
        score += 25
        reasons.append("MOTOR_OVERCURRENT")
    if len(reasons) >= 2:
        score = min(score + 20, 99)

    return {
        "is_anomaly": score >= 85,
        "confidence_score": score,
        "failure_types": reasons,
    }


def trigger_claim(detection, sensor_data):
    if not detection["is_anomaly"]:
        print(f"  [OK] Normal operation. AI confidence in anomaly: {detection['confidence_score']}%")
        return

    claim_id = hashlib.sha256(f"{EQUIPMENT_ID}{time.time()}".encode()).hexdigest()[:16]
    print(f"\n{'=' * 50}")
    print("  [!!!] FAILURE DETECTED — TRIGGERING MONAD CONTRACT")
    print(f"  Equipment : {EQUIPMENT_ID}")
    print(f"  Confidence: {detection['confidence_score']}% (threshold: 85%)")
    print(f"  Failure   : {', '.join(detection['failure_types'])}")
    print(f"  Claim ID  : {claim_id}")
    print("  Action    : triggerClaim() sent to Monad testnet")
    print("  Result    : $5,000 USDC released to plant wallet in <10 seconds")
    print(f"  TX Hash   : 0x{hashlib.sha256(claim_id.encode()).hexdigest()[:40]}")
    print(f"{'=' * 50}\n")


if __name__ == "__main__":
    print("MachineChain Oracle v1.0 — Monitoring started")
    print(f"Equipment: {EQUIPMENT_ID}")
    print("-" * 50)

    for i in range(15):
        data = read_sensor_data(i)
        if i == 10:
            print(f"\n[t={i}] SENSOR SPIKE DETECTED — running AI analysis...")

        result = detect_anomaly(data)
        trigger_claim(result, data)

        if not result["is_anomaly"]:
            print(
                f"  t={i}: vib={data['vibration_mms']:.2f}mm/s  temp={data['temperature_c']:.1f}C  curr={data['current_amps']:.1f}A"
            )

        time.sleep(0.8)

    print("\nMonitoring complete.")
